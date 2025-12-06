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
        'site:.org OR site:.edu OR site:.gov "autismo" agenda visual gratis filetype:pdf',
        'site:.org OR site:.edu "autismo" historia social gratis pdf',
        'site:.org "autismo" tablero comunicación imprimible gratis -precio -tienda',
        'site:.edu "autismo" estrategias guía maestros gratis',
        'site:.gov "autismo" actividades sensoriales guía gratis',
    ];

    const allResources: DiscoveredResource[] = [];

    for (const query of queries) {
        const resources = await searchFreeResources(query);
        allResources.push(...resources);
    }

    // FALLBACK: Recursos verificados sin fines de lucro (En Español/Internacional)
    if (allResources.length === 0) {
        console.log('No resources found via API, using verified non-profit curated list (Spanish)');
        allResources.push(
            {
                title: 'CDC: Indicadores del Desarrollo',
                url: 'https://www.cdc.gov/ncbddd/spanish/autism/index.html',
                fileType: 'webpage',
                rawDescription: 'Guía oficial del CDC en español sobre los indicadores del desarrollo y el autismo.',
            },
            {
                title: 'WHO: Trastornos del espectro autista',
                url: 'https://www.who.int/es/news-room/fact-sheets/detail/autism-spectrum-disorders',
                fileType: 'webpage',
                rawDescription: 'Hoja informativa de la Organización Mundial de la Salud sobre el autismo y normas globales.',
            },
            {
                title: 'Autism Speaks: Manual de los 100 Días',
                url: 'https://www.autismspeaks.org/tool-kit-100-day-kit-young-children-en-espanol', // Ensure this URL is stable or use root
                fileType: 'guide',
                rawDescription: 'Una guía completa y gratuita para familias de niños recién diagnosticados con autismo.',
            },
            {
                title: 'UNESCO: Inclusión Digital',
                url: 'https://unesdoc.unesco.org/ark:/48223/pf0000375276',
                fileType: 'PDF',
                rawDescription: 'Guía de políticas de la UNESCO sobre el uso de soluciones digitales para empoderar a personas con autismo.',
            },
            {
                title: 'OCALI: Módulos de Internet sobre Autismo',
                url: 'https://autisminternetmodules.org/',
                fileType: 'webpage',
                rawDescription: 'Módulos de capacitación gratuitos y de alta calidad para padres y profesionales (Multilingüe).',
            },
            {
                title: 'Reading Rockets: Instrucción de Lectura',
                url: 'https://www.readingrockets.org/topics/autism-spectrum-disorder', // Using Topic Page
                fileType: 'guide',
                rawDescription: 'Estrategias basadas en evidencia para enseñar a leer a niños con TEA.',
            },
            {
                title: 'Do2Learn: Horarios Visuales Gratuitos',
                url: 'https://do2learn.com/picturecards/VisualSchedules/index.htm',
                fileType: 'image',
                rawDescription: 'Horarios visuales imprimibles gratuitos y tablas de comportamiento para rutinas diarias.',
            },
            {
                title: 'VCU-ACE: Prácticas Basadas en Evidencia',
                url: 'https://vcuautismcenter.org/resources/', // Using generic resources page
                fileType: 'webpage',
                rawDescription: 'Lista de prácticas basadas en evidencia de la Virginia Commonwealth University.',
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
