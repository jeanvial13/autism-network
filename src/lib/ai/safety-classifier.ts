import OpenAI from 'openai';
import { PSEUDOSCIENCE_CLASSIFIER_PROMPT, CREDIBILITY_SCORING_PROMPT, fillPromptTemplate, parseAIResponse } from '../prompts';

const getOpenAI = () => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn('OPENAI_API_KEY is not set');
        throw new Error('OPENAI_API_KEY is not set');
    }
    return new OpenAI({ apiKey });
};

export interface SafetyVerdict {
    verdict: 'APPROVE' | 'REJECT' | 'FLAG_FOR_REVIEW';
    reason: string;
    credibilityScore: number;
    concerns?: string[];
    recommendations?: string;
}

export interface CredibilityResult {
    credibilityScore: number;
    type: 'academic' | 'government' | 'nonprofit' | 'commercial' | 'personal';
    isPeerReviewed: boolean;
    isGovtOrg: boolean;
    isMajorInstitution: boolean;
    notes: string;
}

/**
 * Classify content for safety and pseudoscience detection
 */
export async function classifyContent(
    title: string,
    source: string,
    content: string
): Promise<SafetyVerdict> {
    const prompt = fillPromptTemplate(PSEUDOSCIENCE_CLASSIFIER_PROMPT, {
        TITLE: title,
        SOURCE: source,
        CONTENT: content.slice(0, 4000), // Limit content length
    });

    try {
        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a medical safety classifier. Respond only with valid JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3, // Lower temperature for more consistent classification
            response_format: { type: 'json_object' },
        });

        const result = parseAIResponse<SafetyVerdict>(
            response.choices[0].message.content || '{}'
        );

        return result;
    } catch (error) {
        console.error('Error classifying content:', error);
        // Default to flagging for review on error
        return {
            verdict: 'FLAG_FOR_REVIEW',
            reason: 'Error during classification - requires manual review',
            credibilityScore: 50,
        };
    }
}

/**
 * Evaluate source credibility
 */
export async function evaluateSourceCredibility(
    domain: string,
    name: string,
    aboutText: string
): Promise<CredibilityResult> {
    const prompt = fillPromptTemplate(CREDIBILITY_SCORING_PROMPT, {
        DOMAIN: domain,
        NAME: name,
        ABOUT_TEXT: aboutText.slice(0, 2000),
    });

    try {
        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a source credibility evaluator. Respond only with valid JSON.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' },
        });

        const result = parseAIResponse<CredibilityResult>(
            response.choices[0].message.content || '{}'
        );

        return result;
    } catch (error) {
        console.error('Error evaluating source:', error);
        // Default to moderate credibility on error
        return {
            credibilityScore: 50,
            type: 'commercial',
            isPeerReviewed: false,
            isGovtOrg: false,
            isMajorInstitution: false,
            notes: 'Error during evaluation - requires manual review',
        };
    }
}

/**
 * Calculate credibility score using algorithmic approach
 * (alternative to AI-based scoring)
 */
export function calculateCredibilityScore(params: {
    source: string;
    evidenceType: string;
    citations?: number;
    peerReviewed: boolean;
    isGovtOrg?: boolean;
    isMajorInstitution?: boolean;
}): number {
    let score = 50; // Base score

    // Source credibility (+30 max)
    if (params.peerReviewed) {
        score += 30;
    } else if (params.isGovtOrg || params.isMajorInstitution) {
        score += 20;
    }

    // Evidence type (+20 max)
    const evidenceScores: Record<string, number> = {
        systematic_review: 20,
        meta_analysis: 20,
        RCT: 15,
        guidelines: 15,
        observational: 10,
        case_study: 5,
        opinion: 0,
    };
    score += evidenceScores[params.evidenceType] || 0;

    // Citations (up to +10)
    if (params.citations) {
        score += Math.min(params.citations / 10, 10);
    }

    return Math.min(Math.max(score, 0), 100);
}

/**
 * Determine if content should be auto-approved based on source
 */
export function isAutoApprovedSource(domain: string): boolean {
    const trustedDomains = [
        'nih.gov',
        'cdc.gov',
        'who.int',
        'cochrane.org',
        'pubmed.ncbi.nlm.nih.gov',
        'nature.com',
        'sciencedirect.com',
        'jamanetwork.com',
        'thelancet.com',
        'bmj.com',
    ];

    return trustedDomains.some((trusted) => domain.includes(trusted));
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return '';
    }
}
