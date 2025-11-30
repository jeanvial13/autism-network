import OpenAI from 'openai';
import { ARTICLE_GENERATION_PROMPT, fillPromptTemplate, parseAIResponse } from '../prompts';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface ResearchFinding {
    title: string;
    abstract: string;
    url: string;
    publishedDate?: Date;
    source: string;
}

export interface GeneratedArticle {
    title: string;
    slug: string;
    tldrSummary: string;
    backgroundText: string;
    findingsText: string;
    whyItMatters: string;
    practicalTips: string;
    technicalSection?: string;
    tags: string[];
    topics: string[];
    audience: string[];
    evidenceType: string;
    ageGroups: string[];
    sourceUrls: string[];
    sourceName?: string;
    originalPublishedDate?: Date;
}

/**
 * Generate a comprehensive article from research findings
 */
export async function generateArticle(
    findings: ResearchFinding[]
): Promise<GeneratedArticle> {
    // Combine findings into summary
    const findingsSummary = findings
        .map((f, i) => `${i + 1}. ${f.title}\n${f.abstract}\nSource: ${f.url}`)
        .join('\n\n');

    const sourceUrls = findings.map((f) => f.url);
    const originalDate = findings[0]?.publishedDate?.toISOString() || 'Recent';

    const prompt = fillPromptTemplate(ARTICLE_GENERATION_PROMPT, {
        FINDINGS_SUMMARY: findingsSummary,
        SOURCE_URLS: sourceUrls.join('\n'),
        ORIGINAL_DATE: originalDate,
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a medical writer specializing in autism research. Create accurate, compassionate, evidence-based content.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const content = parseAIResponse<Omit<GeneratedArticle, 'slug' | 'sourceUrls' | 'sourceName' | 'originalPublishedDate'>>(
            response.choices[0].message.content || '{}'
        );

        // Generate slug from title
        const slug = generateSlug(content.title);

        return {
            ...content,
            slug,
            sourceUrls,
            sourceName: findings[0]?.source,
            originalPublishedDate: findings[0]?.publishedDate,
        };
    } catch (error) {
        console.error('Error generating article:', error);
        throw new Error('Failed to generate article');
    }
}

/**
 * Generate vector embedding for article
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text.slice(0, 8000), // Limit input length
        });

        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding');
    }
}

/**
 * Create embedding text from article content
 */
export function createEmbeddingText(article: GeneratedArticle): string {
    return `${article.title}\n\n${article.tldrSummary}\n\n${article.backgroundText}\n\n${article.findingsText}`;
}

/**
 * Generate URL-friendly slug
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 100);
}

/**
 * Validate generated article
 */
export function validateArticle(article: GeneratedArticle): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!article.title || article.title.length < 10) {
        errors.push('Title is too short');
    }

    if (!article.tldrSummary || article.tldrSummary.length < 50) {
        errors.push('TL;DR summary is too short');
    }

    if (!article.backgroundText || article.backgroundText.length < 100) {
        errors.push('Background text is insufficient');
    }

    if (!article.findingsText || article.findingsText.length < 100) {
        errors.push('Findings text is insufficient');
    }

    if (!article.sourceUrls || article.sourceUrls.length === 0) {
        errors.push('No source URLs provided');
    }

    if (!article.evidenceType) {
        errors.push('Evidence type is missing');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
