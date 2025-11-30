import OpenAI from 'openai';
import { TRANSLATION_PROMPT, fillPromptTemplate, parseAIResponse } from '../prompts';
import { GeneratedArticle } from './article-generator';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface TranslatedArticle {
    language: string;
    title: string;
    tldrSummary: string;
    backgroundText: string;
    findingsText: string;
    whyItMatters: string;
    practicalTips: string;
    technicalSection?: string;
}

/**
 * Translate article to target language
 */
export async function translateArticle(
    article: GeneratedArticle,
    targetLanguage: string
): Promise<TranslatedArticle> {
    const articleJSON = JSON.stringify({
        title: article.title,
        tldrSummary: article.tldrSummary,
        backgroundText: article.backgroundText,
        findingsText: article.findingsText,
        whyItMatters: article.whyItMatters,
        practicalTips: article.practicalTips,
        technicalSection: article.technicalSection,
    });

    const prompt = fillPromptTemplate(TRANSLATION_PROMPT, {
        TARGET_LANGUAGE: getLanguageName(targetLanguage),
        ARTICLE_JSON: articleJSON,
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional translator specializing in autism-related content. Translate to ${getLanguageName(
                        targetLanguage
                    )} while maintaining accuracy and compassion.`,
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.5,
            response_format: { type: 'json_object' },
        });

        const translated = parseAIResponse<TranslatedArticle>(
            response.choices[0].message.content || '{}'
        );

        return {
            ...translated,
            language: targetLanguage,
        };
    } catch (error) {
        console.error(`Error translating to ${targetLanguage}:`, error);
        throw new Error(`Failed to translate to ${targetLanguage}`);
    }
}

/**
 * Translate article to multiple languages
 */
export async function translateArticleMultiple(
    article: GeneratedArticle,
    languages: string[]
): Promise<TranslatedArticle[]> {
    const translations: TranslatedArticle[] = [];

    for (const lang of languages) {
        try {
            const translated = await translateArticle(article, lang);
            translations.push(translated);
        } catch (error) {
            console.error(`Failed to translate to ${lang}:`, error);
            // Continue with other languages
        }
    }

    return translations;
}

/**
 * Get full language name from code
 */
function getLanguageName(code: string): string {
    const names: Record<string, string> = {
        en: 'English',
        es: 'Spanish',
        pt: 'Portuguese',
        fr: 'French',
        de: 'German',
        it: 'Italian',
        ja: 'Japanese',
        zh: 'Chinese (Simplified)',
        ar: 'Arabic',
    };

    return names[code] || code;
}

/**
 * Detect if translation is needed based on user's location
 */
export function detectPreferredLanguage(
    countryCode?: string,
    userPreference?: string
): string {
    if (userPreference) {
        return userPreference;
    }

    // Map country codes to languages
    const countryToLanguage: Record<string, string> = {
        US: 'en',
        GB: 'en',
        CA: 'en',
        AU: 'en',
        ES: 'es',
        MX: 'es',
        AR: 'es',
        CO: 'es',
        BR: 'pt',
        PT: 'pt',
        FR: 'fr',
        DE: 'de',
        IT: 'it',
        JP: 'ja',
        CN: 'zh',
    };

    return countryToLanguage[countryCode || ''] || 'en';
}

/**
 * Get supported languages
 */
export function getSupportedLanguages(): string[] {
    return ['en', 'es', 'pt'];
}
