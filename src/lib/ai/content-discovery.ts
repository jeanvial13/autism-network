import { ResearchFinding } from './article-generator';

/**
 * Search for recent autism research using Google Custom Search
 */
export async function searchAutismResearch(
    query: string,
    daysBack: number = 30
): Promise<ResearchFinding[]> {
    const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
    const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !searchEngineId) {
        console.warn('Google Custom Search not configured');
        return [];
    }

    try {
        // Calculate date range
        const dateAfter = new Date();
        dateAfter.setDate(dateAfter.getDate() - daysBack);
        const dateStr = dateAfter.toISOString().split('T')[0];

        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.set('key', apiKey);
        url.searchParams.set('cx', searchEngineId);
        url.searchParams.set('q', query);
        url.searchParams.set('dateRestrict', `d${daysBack}`);
        url.searchParams.set('num', '10');

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!data.items) {
            return [];
        }

        return data.items.map((item: any) => ({
            title: item.title,
            abstract: item.snippet,
            url: item.link,
            source: extractSource(item.link),
            publishedDate: extractDate(item),
        }));
    } catch (error) {
        console.error('Error searching research:', error);
        return [];
    }
}

/**
 * Search academic databases (PubMed)
 */
export async function searchPubMed(
    query: string,
    maxResults: number = 10
): Promise<ResearchFinding[]> {
    try {
        // Search PubMed
        const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
            query + ' AND autism[MeSH Terms]'
        )}&retmax=${maxResults}&retmode=json&sort=pub_date`;

        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        const ids = searchData.esearchresult?.idlist || [];

        if (ids.length === 0) {
            return [];
        }

        // Fetch article details
        const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(
            ','
        )}&retmode=json`;

        const fetchResponse = await fetch(fetchUrl);
        const fetchData = await fetchResponse.json();

        const findings: ResearchFinding[] = [];

        for (const id of ids) {
            const article = fetchData.result?.[id];
            if (article) {
                findings.push({
                    title: article.title,
                    abstract: article.source || '',
                    url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
                    source: 'PubMed',
                    publishedDate: parseDate(article.pubdate),
                });
            }
        }

        return findings;
    } catch (error) {
        console.error('Error searching PubMed:', error);
        return [];
    }
}

/**
 * Combine and deduplicate findings from multiple sources
 */
export async function discoverAutismContent(): Promise<ResearchFinding[]> {
    const queries = [
        'autism diagnosis research',
        'autism intervention study',
        'autism education support',
        'autism technology inclusion',
    ];

    const allFindings: ResearchFinding[] = [];

    // Search Google Custom Search
    for (const query of queries) {
        const findings = await searchAutismResearch(query);
        allFindings.push(...findings);
    }

    // Search PubMed
    const pubmedFindings = await searchPubMed('autism', 5);
    allFindings.push(...pubmedFindings);

    // Deduplicate by URL
    const uniqueUrls = new Set<string>();
    const uniqueFindings: ResearchFinding[] = [];

    for (const finding of allFindings) {
        if (!uniqueUrls.has(finding.url)) {
            uniqueUrls.add(finding.url);
            uniqueFindings.push(finding);
        }
    }

    return uniqueFindings;
}

/**
 * Filter findings by credibility
 */
export function filterByCredibility(
    findings: ResearchFinding[],
    trustedDomains: Set<string>
): ResearchFinding[] {
    return findings.filter((finding) => {
        const domain = extractDomain(finding.url);
        return trustedDomains.has(domain) || isPeerReviewedJournal(domain);
    });
}

/**
 * Extract source name from URL
 */
function extractSource(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return 'Unknown';
    }
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return '';
    }
}

/**
 * Check if domain is a known peer-reviewed journal
 */
function isPeerReviewedJournal(domain: string): boolean {
    const journals = [
        'nature.com',
        'sciencedirect.com',
        'jamanetwork.com',
        'thelancet.com',
        'bmj.com',
        'nejm.org',
        'psychiatryonline.org',
    ];

    return journals.some((j) => domain.includes(j));
}

/**
 * Extract date from search result
 */
function extractDate(item: any): Date | undefined {
    if (item.pagemap?.metatags?.[0]?.['article:published_time']) {
        return new Date(item.pagemap.metatags[0]['article:published_time']);
    }
    return undefined;
}

/**
 * Parse PubMed date string
 */
function parseDate(dateStr: string): Date | undefined {
    try {
        return new Date(dateStr);
    } catch {
        return undefined;
    }
}
