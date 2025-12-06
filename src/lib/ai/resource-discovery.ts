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
        'site:.org OR site:.edu OR site:.gov "autismo" actividades imprimibles gratis',
        'site:.org "autism" printable visual schedules pdf free',
        'site:.edu "autismo" cuentos sociales pdf gratis',
        'site:.org "autism" teacher guides classroom activities free',
    ];

    const allResources: DiscoveredResource[] = [];

    // Limit queries to avoid too many results
    for (const query of queries.slice(0, 3)) {
        const resources = await searchFreeResources(query);
        allResources.push(...resources);
    }

    // FALLBACK: Recursos verificados y estables (Root/Index URLs)
    // Si la API falla, seleccionamos 4 de esta lista de 8 para variar resultados
    if (allResources.length === 0) {
        console.log('No resources found via API, using shuffled fallback list');
        const fallbackPool = [
            {
                title: 'ARASAAC: Pictogramas (ES)',
                url: 'https://arasaac.org/',
                fileType: 'image',
                rawDescription: 'El mayor catálogo mundial de sistemas aumentativos y alternativos de comunicación (SAAC).',
            },
            {
                title: 'CDC: Aprenda los Signos (ES)',
                url: 'https://www.cdc.gov/ncbddd/spanish/actearly/index.html',
                fileType: 'webpage',
                rawDescription: 'Recursos oficiales del CDC en español para monitorear el desarrollo infantil.',
            },
            {
                title: 'Do2Learn: Educational Resources (EN)',
                url: 'https://do2learn.com/',
                fileType: 'activity',
                rawDescription: 'Thousands of free pages of social skills, behavioral regulation, and life skills activities.',
            },
            {
                title: 'Reading Rockets: Autism (EN)',
                url: 'https://www.readingrockets.org/topics/autism-spectrum-disorder',
                fileType: 'guide',
                rawDescription: 'Strategies for teaching reading and literacy to children on the autism spectrum.',
            },
            {
                title: 'Understood.org: Guía de Autismo (ES)',
                url: 'https://www.understood.org/es-mx',
                fileType: 'webpage',
                rawDescription: 'Recursos prácticos para desafíos de aprendizaje y atención en español.',
            },
            {
                title: 'Child Mind Institute: Autismo (ES)',
                url: 'https://childmind.org/es/temas/trastornos-del-espectro-autista/',
                fileType: 'guide',
                rawDescription: 'Guías completas sobre diagnóstico, tratamiento y apoyo familiar.',
            },
            {
                title: 'Autism Society: Recursos (EN)',
                url: 'https://autismsociety.org/resources/',
                fileType: 'webpage',
                rawDescription: 'Comprehensive resource database for families and professionals.',
            },
            {
                title: 'VCU Autism Center (EN)',
                url: 'https://vcuautismcenter.org/resources/',
                fileType: 'webpage',
                rawDescription: 'Evidence-based resources and visual supports for schools and families.',
            }
        ];

        // Shuffle and pick 4
        allResources.push(...fallbackPool.sort(() => 0.5 - Math.random()).slice(0, 4));
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
        // Stop if we have enough resources
        if (processedResources.length >= 4) break;

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

    return processedResources.slice(0, 4);
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
