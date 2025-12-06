import OpenAI from 'openai';
import { RESOURCE_DESCRIPTION_PROMPT, fillPromptTemplate, parseAIResponse } from '../prompts';

const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn('OPENAI_API_KEY is not set');
        // Return a dummy object or throw depending on usage, but for build safety just return null or throw at runtime
        throw new Error('OPENAI_API_KEY is not set');
    }
    return new OpenAI({ apiKey });
};

export interface DiscoveredResource {
    title: string;
    url: string;
    fileType: string;
    rawDescription?: string;
}

export interface ResourceDetails {
    description: string;
    targetAge: string[];
    audience: string[];
    topics: string[];
    format: string[];
    suggestedUses: string[];
}

/**
 * Search for free autism resources
 */
export async function searchFreeResources(
    query: string
): Promise<DiscoveredResource[]> {
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
        console.warn('Google Custom Search not configured');
        return [];
    }

    try {
        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.set('key', apiKey);
        url.searchParams.set('cx', searchEngineId);
        url.searchParams.set('q', query + ' free download autism');
        url.searchParams.set('num', '10');

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!data.items) {
            return [];
        }

        return data.items.map((item: any) => ({
            title: item.title,
            url: item.link,
            fileType: detectFileType(item.link, item.mime),
            rawDescription: item.snippet,
        }));
    } catch (error) {
        console.error('Error searching resources:', error);
        return [];
    }
}

/**
 * Generate AI description for resource
 */
export async function generateResourceDescription(
    resource: DiscoveredResource
): Promise<ResourceDetails> {
    const prompt = fillPromptTemplate(RESOURCE_DESCRIPTION_PROMPT, {
        TITLE: resource.title,
        URL: resource.url,
        FILE_TYPE: resource.fileType,
        TOPIC: extractTopic(resource.title),
    });

    try {
        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are creating helpful descriptions for autism educational resources.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const details = parseAIResponse<ResourceDetails>(
            response.choices[0].message.content || '{}'
        );

        return details;
    } catch (error) {
        console.error('Error generating resource description:', error);
        // Return minimal details on error
        return {
            description: resource.rawDescription || resource.title,
            targetAge: ['kids'],
            audience: ['parent', 'teacher'],
            topics: ['general'],
            format: [resource.fileType],
            suggestedUses: [],
        };
    }
}

/**
 * Discover and process resources
 */
export async function discoverAutismResources(): Promise<
    Array<DiscoveredResource & ResourceDetails>
> {
    const queries = [
        'site:.org OR site:.edu OR site:.gov "autism" visual schedule free filetype:pdf',
        'site:.org OR site:.edu "autism" social story free pdf',
        'site:.org "autism" communication board printable free -price -shop',
        'site:.edu "autism" strategies teacher guide free',
        'site:.gov "autism" sensory activities guide free',
    ];

    const allResources: DiscoveredResource[] = [];

    for (const query of queries) {
        const resources = await searchFreeResources(query);
        allResources.push(...resources);
    }

    // FALLBACK: Verified High-Quality Non-Profit Resources
    if (allResources.length === 0) {
        console.log('No resources found via API, using verified non-profit curated list');
        allResources.push(
            {
                title: 'CDC: Autism Milestones Tracker',
                url: 'https://www.cdc.gov/ncbddd/autism/access/early-intervention.html',
                fileType: 'webpage',
                rawDescription: 'Official CDC guide for tracking developmental milestones and early intervention.'
            },
            {
                title: 'WHO: Autism Spectrum Disorders',
                url: 'https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders',
                fileType: 'webpage',
                rawDescription: 'World Health Organization comprehensive fact sheet and global standards on autism.'
            },
            {
                title: 'Autism Speaks: 100 Day Kit',
                url: 'https://www.autismspeaks.org/tool-kit/100-day-kit-young-children',
                fileType: 'guide',
                rawDescription: 'A free, comprehensive guide for families of children recently diagnosed with autism.'
            },
            {
                title: 'UNESCO: Digital Inclusion for Autism',
                url: 'https://unesdoc.unesco.org/ark:/48223/pf0000375276',
                fileType: 'PDF',
                rawDescription: 'UNESCO policy guide on using digital solutions to empower people with autism.'
            },
            {
                title: 'OCALI: Autism Internet Modules',
                url: 'https://autisminternetmodules.org/',
                fileType: 'webpage',
                rawDescription: 'Free high-quality training modules for parents and professionals from OCALI.'
            },
            {
                title: 'Reading Rockets: Literacy for Autism',
                url: 'https://www.readingrockets.org/article/literacy-instruction-students-autism-spectrum-disorder',
                fileType: 'guide',
                rawDescription: 'Evidence-based strategies for teaching reading to children with ASD.'
            },
            {
                title: 'Do2Learn: Free Visual Schedules',
                url: 'https://do2learn.com/picturecards/VisualSchedules/index.htm',
                fileType: 'image',
                rawDescription: 'Free printable visual schedules and behavioral charts for daily routines.'
            },
            {
                title: 'VCU-ACE: Evidence-Based Practices',
                url: 'https://vcuautismcenter.org/resources/evidence_based_practices.cfm',
                fileType: 'webpage',
                rawDescription: 'Virginia Commonwealth University list of evidence-based practices for autism.'
            }
        );
    }

    // Deduplicate by URL
    const uniqueUrls = new Set<string>();
    const uniqueResources: DiscoveredResource[] = [];

    for (const resource of allResources) {
        if (!uniqueUrls.has(resource.url)) {
            uniqueUrls.add(resource.url);
            uniqueResources.push(resource);
        }
    }

    // Generate descriptions for each resource
    const processedResources: Array<DiscoveredResource & ResourceDetails> = [];

    for (const resource of uniqueResources) {
        try {
            const details = await generateResourceDescription(resource);
            processedResources.push({
                ...resource,
                ...details,
            });
        } catch (error) {
            console.error(`Failed to process resource ${resource.url}:`, error);
        }
    }

    return processedResources;
}

/**
 * Validate resource link
 */
export async function validateResourceLink(url: string): Promise<boolean> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * Detect file type from URL and MIME type
 */
function detectFileType(url: string, mime?: string): string {
    if (mime) {
        if (mime.includes('pdf')) return 'PDF';
        if (mime.includes('doc')) return 'DOC';
        if (mime.includes('image')) return 'image';
    }

    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'PDF';
        case 'doc':
        case 'docx':
            return 'DOC';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return 'image';
        default:
            return 'webpage';
    }
}

/**
 * Extract topic from title
 */
function extractTopic(title: string): string {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('communication')) return 'communication';
    if (lowerTitle.includes('social')) return 'social skills';
    if (lowerTitle.includes('sensory')) return 'sensory';
    if (lowerTitle.includes('schedule')) return 'visual schedule';
    if (lowerTitle.includes('emotion')) return 'emotional regulation';
    if (lowerTitle.includes('behavior')) return 'behavior support';

    return 'general';
}

/**
 * Extract source name from URL
 */
export function extractSourceName(url: string): string {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        return domain.split('.')[0];
    } catch {
        return 'Unknown';
    }
}
