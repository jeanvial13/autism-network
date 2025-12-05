import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Test Data Generation Endpoint
 * 
 * Use this to quickly populate the database with sample data for testing
 * GET /api/test-populate?secret=changeme_dev_secret
 */
export async function GET(request: NextRequest) {
    // Verify secret
    const url = new URL(request.url);
    const secretParam = url.searchParams.get('secret');
    const secret = process.env.CRON_SECRET || process.env.NEXTAUTH_SECRET;

    if (secretParam !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[TEST] Starting test data population...');


    // ========================================
    // 2. CREATE EDUCATIONAL RESOURCES  
    // ========================================
    console.log('[TEST] Creating educational resources...');

    const resources = [
        {
            title: 'Visual Schedule for Morning Routine',
            description: 'A printable visual schedule with picture cards to help children follow their morning routine independently.',
            topics: ['daily_living', 'communication'],
        },
        {
            title: 'Social Stories: Making Friends at School',
            description: 'A social story template to help autistic children understand and navigate social situations at school.',
            topics: ['social_skills', 'communication'],
        },
        {
            title: 'Emotion Cards for Identification',
            description: 'Colorful emotion identification cards featuring diverse faces expressing different feelings.',
            topics: ['communication', 'social_skills'],
        },
        {
            title: 'Sensory Break Activity Cards',
            description: 'Quick sensory break activities that can be done at home or in the classroom.',
            topics: ['sensory', 'behavior_support'],
        },
        {
            title: 'Communication Board - Basic Needs',
            description: 'A printable communication board with symbols for basic needs and wants.',
            topics: ['communication'],
        },
    ];

    let resCount = 0;
    for (let i = 0; i < resources.length; i++) {
        const resource = resources[i];
        // Use raw executeRaw to insert with vector embedding
        await prisma.$executeRaw`
                INSERT INTO "EducationalResource" (
                    id, title, description, "suggestedUses", url, "fileType", 
                    "isDownloadable", "requiresAccount", "targetAge", audience, 
                    topics, format, language, "sourceName", "sourceUrl", 
                    "credibilityScore", status, "lastCheckedDate", embedding
                ) VALUES (
                    gen_random_uuid(),
                    ${resource.title},
                    ${resource.description},
                    ${'Great for home or classroom use'},
                    ${'https://example.com/resource-' + i},
                    'PDF',
                    true,
                    false,
                    ARRAY['early_childhood', 'elementary']::text[],
                    ARRAY['parents', 'educators']::text[],
                    ${resource.topics}::text[],
                    ARRAY['worksheet', 'guide']::text[],
                    'en',
                    'Autism Resource Hub',
                    'https://example.com',
                    85,
                    'APPROVED',
                    NOW(),
                    array_fill(0, ARRAY[1536])::vector
                )
                ON CONFLICT DO NOTHING
            `;
        resCount++;
    }

    console.log(`[TEST] Created ${resCount} educational resources`);

    // ========================================
    // 3. CREATE ARTICLES
    // ========================================
    console.log('[TEST] Creating articles...');

    const articles = [
        {
            slug: 'early-intervention-benefits-' + Date.now(),
            title: 'Early Intervention Programs Show Significant Benefits for Autistic Toddlers',
            tldr: 'New research confirms that early intervention programs starting before age 3 lead to improved social communication and reduced support needs.',
            topics: ['diagnosis', 'intervention', 'education'],
        },
        {
            slug: 'technology-assistive-communication-' + Date.now(),
            title: 'Assistive Communication Technology Opens New Doors for Non-Speaking Autistic Individuals',
            tldr: 'Modern AAC devices and apps are transforming communication for non-speaking autistic people.',
            topics: ['technology', 'communication', 'inclusion'],
        },
        {
            slug: 'sensory-workplace-accommodations-' + Date.now(),
            title: 'Sensory-Friendly Workplace Modifications Boost Autistic Employee Performance',
            tldr: 'Simple workplace accommodations for sensory differences improve productivity and job satisfaction.',
            topics: ['inclusion', 'employment', 'sensory'],
        },
    ];

    let artCount = 0;
    for (const article of articles) {
        await prisma.$executeRaw`
                INSERT INTO "Article" (
                    id, slug, title, "tldrSummary", "backgroundText", "findingsText",
                    "whyItMatters", "practicalTips", "technicalSection", tags, topics,
                    audience, "ageGroups", "evidenceType", "sourceUrls", "sourceName",
                    "originalPublishedDate", "credibilityScore", status, "aiGeneratedDate",
                    embedding
                ) VALUES (
                    gen_random_uuid(),
                    ${article.slug},
                    ${article.title},
                    ${article.tldr},
                    ${'This research examines the latest findings in autism support and intervention strategies.'},
                    ${'Studies show significant positive outcomes when appropriate support is provided early and consistently.'},
                    ${'These findings help families and professionals make informed decisions about autism support approaches.'},
                    ${'• Seek evaluation if you notice developmental differences\n• Look for evidence-based programs\n• Involve the whole family in support strategies'},
                    ${'Study used standardized assessments with significant effect sizes (p<0.001).'},
                    ARRAY['autism', 'research']::text[],
                    ${article.topics}::text[],
                    ARRAY['parents', 'professionals']::text[],
                    ARRAY['early_childhood', 'elementary']::text[],
                    'Research Study',
                    ARRAY['https://example.com/research']::text[],
                    'Journal of Autism Research',
                    ${new Date()},
                    92,
                    'APPROVED',
                    NOW(),
                    array_fill(0, ARRAY[1536])::vector
                )
                ON CONFLICT DO NOTHING
            `;
        artCount++;
    }

    console.log(`[TEST] Created ${artCount} articles`);

    return NextResponse.json({
        success: true,
        message: 'Test data populated successfully',
        data: {
            professionals: profCount,
            resources: resCount,
            articles: artCount,
        },
    });
} catch (error) {
    console.error('[TEST] Error populating data:', error);
    return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
}
}
