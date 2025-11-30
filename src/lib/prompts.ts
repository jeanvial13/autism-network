/**
 * Prompt Templates for AI Content Generation
 * 
 * This file contains all the carefully crafted prompts for:
 * - Article generation from scientific sources
 * - Resource descriptions
 * - Content translation
 * - Safety and credibility classification
 */

export const ARTICLE_GENERATION_PROMPT = `
You are a medical writer specializing in autism research. Write a comprehensive, accessible article about the following research findings.

REQUIREMENTS:
- Use autism-affirming language (e.g., "autistic person" OR "person with autism" - both are acceptable)
- Be respectful and non-stigmatizing
- Avoid pathologizing language where inappropriate
- Write clearly for families, with a technical section for professionals
- Include practical applications
- Cite sources accurately
- Be calm, supportive, and non-alarmist

RESEARCH FINDINGS:
{FINDINGS_SUMMARY}

ORIGINAL SOURCES:
{SOURCE_URLS}

PUBLISHED DATE: {ORIGINAL_DATE}

OUTPUT STRUCTURE (JSON):
{
  "title": "Engaging, clear title (max 100 characters)",
  "tldrSummary": "2-3 sentences in plain language explaining what families need to know",
  "backgroundText": "Context and background - why this research matters",
  "findingsText": "What the research shows - main discoveries and results",
  "whyItMatters": "Practical significance - how this affects families, education, or support",
  "practicalTips": "Actionable advice for families/educators in bullet points",
  "technicalSection": "More detailed explanation for professionals including methodology and statistical findings",
  "tags": ["diagnosis", "intervention", "education", "technology", "inclusion", "research"],
  "topics": ["specific_topic_1", "specific_topic_2"],
  "audience": ["parents", "autistic_adults", "professionals", "educators"],
  "evidenceType": "systematic_review" | "RCT" | "case_study" | "guidelines" | "observational" | "meta_analysis",
  "ageGroups": ["early_childhood", "kids", "teens", "adults"]
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting or extra text.
`;

export const RESOURCE_DESCRIPTION_PROMPT = `
You are creating a friendly, helpful description for a free educational resource for autism support.

RESOURCE INFO:
Title: {TITLE}
URL: {URL}
File Type: {FILE_TYPE}
Apparent Topic: {TOPIC}

Your task:
1. Write a clear 2-3 sentence description
2. Identify who it's for (age/audience)
3. What skills or areas it helps develop
4. 2-3 suggested uses

Requirements:
- Be warm, helpful, and practical
- Use autism-affirming language
- Focus on strengths and capabilities
- Avoid jargon
- Be specific about how to use it

OUTPUT (JSON):
{
  "description": "Clear, friendly description of what this resource is",
  "targetAge": ["early_childhood", "elementary", "teens", "adults"],
  "audience": ["parent", "teacher", "therapist", "autistic_individual"],
  "topics": ["communication", "social_skills", "sensory", "academic", "daily_living", "behavior_support", "executive_function"],
  "format": ["worksheet", "coloring", "visual_schedule", "guide", "activity", "social_story"],
  "suggestedUses": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

IMPORTANT: Return ONLY valid JSON.
`;

export const TRANSLATION_PROMPT = `
Translate the following autism-related article to {TARGET_LANGUAGE}.

REQUIREMENTS:
- Maintain autism-affirming tone and respectful language
- Keep medical and technical terms accurate (provide translations in parentheses if needed)
- Use clear, accessible language that families can understand
- Preserve structure and formatting
- Adapt idioms and expressions to be culturally appropriate
- Maintain the supportive, calm tone

ARTICLE DATA:
{ARTICLE_JSON}

OUTPUT: Return the translated article in the same JSON structure with all fields translated.

IMPORTANT: Return ONLY valid JSON.
`;

export const PSEUDOSCIENCE_CLASSIFIER_PROMPT = `
You are a medical safety classifier specializing in autism research and interventions. Analyze the following autism-related content and determine if it contains pseudoscience, harmful claims, or unproven treatments.

REJECT if content promotes:
- "Miracle cures" or claims that autism can be "cured" or "recovered from"
- Chelation therapy, bleach/MMS (chlorine dioxide), or other dangerous treatments
- Anti-vaccine misinformation or autism-vaccine links
- Unproven biomedical interventions without evidence base (e.g., unsupported diets, supplements)
- Harmful ABA practices without consent or that prioritize compliance over wellbeing
- Conversion therapy or attempts to "eliminate" autistic traits
- Exploitative or ableist language that portrays autism solely as a tragedy or burden

APPROVE if content is:
- Evidence-based (peer-reviewed research, established medical guidelines)
- From credible medical/educational institutions (universities, health organizations, autism research centers)
- Balanced and respectful of autistic perspectives
- Autism-affirming and strengths-based
- Transparent about limitations and unknowns

FLAG FOR REVIEW if:
- Source credibility is unclear
- Claims are partially supported but need context
- Language is somewhat concerning but intent seems positive
- Novel research that hasn't been replicated

CONTENT TO ANALYZE:
Title: {TITLE}
Source: {SOURCE}
Content: {CONTENT}

Respond with JSON:
{
  "verdict": "APPROVE" | "REJECT" | "FLAG_FOR_REVIEW",
  "reason": "Brief, specific explanation of your decision",
  "credibilityScore": 0-100,
  "concerns": ["List any specific concerns, if applicable"],
  "recommendations": "Optional suggestions for improvement if flagged"
}

IMPORTANT: Return ONLY valid JSON.
`;

export const CREDIBILITY_SCORING_PROMPT = `
You are evaluating the credibility of an autism-related source for use in our platform.

SOURCE INFORMATION:
Domain: {DOMAIN}
Name: {NAME}
About: {ABOUT_TEXT}

Evaluate based on:
1. **Authority** - Is this a recognized medical, research, or educational institution?
2. **Peer Review** - Does this source publish peer-reviewed content?
3. **Transparency** - Are authors, funding, and methodology clearly stated?
4. **Bias** - Are there commercial interests or conflicts of interest?
5. **Accuracy Track Record** - Is the source known for accurate, evidence-based information?

SCORING GUIDE:
- 90-100: Top-tier (NIH, CDC, major universities, Cochrane, peer-reviewed journals)
- 70-89: Strong (reputable nonprofits, established autism orgs, credentialed professionals)
- 50-69: Moderate (mixed credibility, needs case-by-case review)
- 30-49: Weak (unclear credentials, limited peer review)
- 0-29: Unreliable (known for pseudoscience, commercial bias, or misinformation)

OUTPUT (JSON):
{
  "credibilityScore": 0-100,
  "type": "academic" | "government" | "nonprofit" | "commercial" | "personal",
  "isPeerReviewed": true | false,
  "isGovtOrg": true | false,
  "isMajorInstitution": true | false,
  "notes": "Brief explanation of the rating"
}

IMPORTANT: Return ONLY valid JSON.
`;

export const CONTENT_CLUSTERING_PROMPT = `
You are analyzing multiple autism research findings to identify similar topics that should be grouped together.

RESEARCH ITEMS:
{RESEARCH_LIST}

Your task:
1. Identify themes and common topics
2. Group related findings
3. Suggest how to merge them into comprehensive articles
4. Recommend article titles

Requirements:
- Cluster by topic (e.g., all early diagnosis studies together)
- Avoid creating too many tiny articles (aim for 1-3 rich articles per day)
- Prioritize the most important/recent findings
- Ensure each cluster has enough substance for a full article

OUTPUT (JSON):
{
  "clusters": [
    {
      "theme": "Main topic of this cluster",
      "suggestedTitle": "Proposed article title",
      "includedFindings": [1, 3, 5],
      "rationale": "Why these should be combined"
    }
  ],
  "singles": [2, 4],
  "reasoning": "Overall clustering strategy explanation"
}

IMPORTANT: Return ONLY valid JSON.
`;

/**
 * Helper function to fill in prompt templates
 */
export function fillPromptTemplate(
    template: string,
    variables: Record<string, string>
): string {
    let filled = template;
    for (const [key, value] of Object.entries(variables)) {
        filled = filled.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return filled;
}

/**
 * Parse JSON response from OpenAI, handling potential formatting issues
 */
export function parseAIResponse<T>(response: string): T {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.slice(0, -3);
    }

    return JSON.parse(cleaned.trim());
}
