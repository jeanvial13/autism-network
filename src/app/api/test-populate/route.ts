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

    try {
        // ========================================
        // 1. CREATE PROFESSIONAL PROFILES
        // ========================================
        console.log('[TEST] Creating professional profiles...');

        const professionals = [
            { name: 'Dr. Alejandro García', email: 'alejandro.g@example.com', specialty: 'Terapia ABA', city: 'Ciudad de México', lat: 19.4326, lng: -99.1332, country: 'México' },
            { name: 'Dra. María Fernández', email: 'maria.f@example.com', specialty: 'Terapia de Habla', city: 'Guadalajara', lat: 20.6597, lng: -103.3496, country: 'México' },
            { name: 'Dr. Carlos López', email: 'carlos.l@example.com', specialty: 'Terapia Ocupacional', city: 'Monterrey', lat: 25.6866, lng: -100.3161, country: 'México' },
            { name: 'Dra. Ana Torres', email: 'ana.t@example.com', specialty: 'Diagnóstico', city: 'Bogotá', lat: 4.7110, lng: -74.0721, country: 'Colombia' },
            { name: 'Dr. Diego Ramirez', email: 'diego.r@example.com', specialty: 'Terapia ABA', city: 'Buenos Aires', lat: -34.6037, lng: -58.3816, country: 'Argentina' },
            { name: 'Dra. Valentina Silva', email: 'valentina.s@example.com', specialty: 'Apoyo Conductual', city: 'Santiago', lat: -33.4489, lng: -70.6693, country: 'Chile' },
            { name: 'Dr. Javier Mendoza', email: 'javier.m@example.com', specialty: 'Terapia de Habla', city: 'Lima', lat: -12.0464, lng: -77.0428, country: 'Perú' },
            { name: 'Dra. Camila Oliveira', email: 'camila.o@example.com', specialty: 'Terapia Ocupacional', city: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brasil' },
            { name: 'Dr. Ricardo Vargas', email: 'ricardo.v@example.com', specialty: 'Diagnóstico', city: 'Ciudad de México', lat: 19.3900, lng: -99.1500, country: 'México' },
            { name: 'Dra. Laura Martinez', email: 'laura.m@example.com', specialty: 'Habilidades Sociales', city: 'Cancún', lat: 21.1619, lng: -86.8515, country: 'México' },
        ];

        let profCount = 0;
        for (const prof of professionals) {
            // Check if user exists
            const existing = await prisma.user.findUnique({ where: { email: prof.email } });
            if (existing) continue;

            const user = await prisma.user.create({
                data: {
                    name: prof.name,
                    email: prof.email,
                    role: 'PROFESSIONAL',
                },
            });

            await prisma.professionalProfile.create({
                data: {
                    userId: user.id,
                    bio: `Especialista en ${prof.specialty} con ${Math.floor(Math.random() * 15) + 5} años de experiencia brindando apoyo basado en evidencia.`,
                    specialties: [prof.specialty, 'Apoyo Familiar'],
                    licenseNumber: `LIC${Math.floor(Math.random() * 100000)}`,
                    licenseCountry: prof.country,
                    locationLat: prof.lat,
                    locationLng: prof.lng,
                    verificationStatus: 'VERIFIED',
                },
            });
            profCount++;
        }

        console.log(`[TEST] Created ${profCount} professional profiles`);

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
