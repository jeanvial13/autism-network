import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { discoverAutismArticles } from '@/lib/ai/article-discovery';

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
    console.log('Starting article discovery process...');

    // 1. Authentication
    const authHeader = req.headers.get('authorization');
    const secretHeader = req.headers.get('x-cron-secret');

    // Allow manual trigger from UI with temporary secret
    const isManualTrigger = secretHeader === 'MY_TEMPORARY_SECRET_123';

    // For Cron jobs
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCron && !isManualTrigger) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Clear existing articles if manual trigger (Fresh Start)
        if (isManualTrigger) {
            console.log('Manual trigger: Clearing existing articles...');
            await prisma.article.deleteMany({}); // Delete ALL articles
            console.log('Articles database cleared.');
        }

        // 3. Discover new articles
        console.log('Fetching new articles via AI...');
        const newArticles = await discoverAutismArticles();

        console.log(`Found ${newArticles.length} new articles to save.`);

        // 4. Save to Database
        let savedCount = 0;
        for (const article of newArticles) {

            // Create slug from title
            const slug = article.title
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]+/g, '-') // replace non-alphanum with dash
                .replace(/(^-|-$)+/g, ''); // remove leading/trailing dashes

            // Ensure unique slug
            const uniqueSlug = `${slug}-${Date.now()}`;

            await prisma.article.create({
                data: {
                    ...article,
                    slug: uniqueSlug,
                    sourceUrls: article.sourceUrls || [],
                    tags: article.tags || [],
                    topics: article.topics || [],
                    audience: article.audience || [],
                    ageGroups: article.ageGroups || [],
                    aiGeneratedDate: new Date(),
                    status: 'APPROVED', // Auto-approve for demo
                    // Create a Spanish translation entry automatically since the content is Spanish
                    translations: {
                        create: {
                            language: 'es',
                            title: article.title,
                            tldrSummary: article.tldrSummary,
                            backgroundText: article.backgroundText,
                            findingsText: article.findingsText,
                            whyItMatters: article.whyItMatters,
                            practicalTips: article.practicalTips,
                            technicalSection: article.technicalSection
                        }
                    }
                }
            });
            savedCount++;
        }

        return NextResponse.json({
            success: true,
            count: savedCount,
            message: `Successfully generated ${savedCount} articles.`
        });

    } catch (error) {
        console.error('Error in article discovery:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
