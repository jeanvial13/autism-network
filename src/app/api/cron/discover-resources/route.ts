import { NextRequest, NextResponse } from 'next/server';
import { discoverAutismResources, extractSourceName } from '@/lib/ai/resource-discovery';
import { generateEmbedding } from '@/lib/ai/article-generator';
import { prisma } from '@/lib/prisma';

/**
 * Resource Discovery Cron Job
 * 
 * Schedule: Every 48 hours
 * 
 * Steps:
 * 1. Search for free autism resources
 * 2. Generate AI descriptions
 * 3. Create vector embeddings
 * 4. Save to database
 */
export async function GET(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON] Starting resource discovery...');

    try {
        // Step 1: Discover resources
        console.log('[CRON] Searching for resources...');
        const resources = await discoverAutismResources();
        console.log(`[CRON] Found ${resources.length} potential resources`);

        if (resources.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No new resources discovered',
                resourcesAdded: 0,
            });
        }

        let addedCount = 0;
        let skippedCount = 0;

        // Step 2: Process each resource
        for (const resource of resources) {
            try {
                // Check if resource already exists
                const existing = await prisma.educationalResource.findFirst({
                    where: { url: resource.url },
                });

                if (existing) {
                    console.log(`[CRON] Resource already exists: ${resource.url}`);
                    skippedCount++;
                    continue;
                }

                // Generate embedding
                const embeddingText = `${resource.title}\n${resource.description}\n${resource.topics.join(' ')}`;
                const embedding = await generateEmbedding(embeddingText);

                // Detect if downloadable
                const isDownloadable = ['PDF', 'DOC', 'image'].includes(resource.fileType);

                // Save to database
                await prisma.educationalResource.create({
                    data: {
                        title: resource.title,
                        description: resource.description,
                        suggestedUses: resource.suggestedUses,
                        url: resource.url,
                        fileType: resource.fileType,
                        isDownloadable,
                        requiresAccount: false, // Would need to detect this
                        targetAge: resource.targetAge,
                        audience: resource.audience,
                        topics: resource.topics,
                        format: resource.format,
                        language: 'en',
                        sourceName: extractSourceName(resource.url),
                        sourceUrl: resource.url,
                        credibilityScore: 70, // Default score
                        status: 'PENDING', // Require manual review initially
                        embedding: embedding as any,
                    } as any,
                });

                addedCount++;
                console.log(`[CRON] Added resource: ${resource.title}`);
            } catch (error) {
                console.error(`[CRON] Error processing resource ${resource.url}:`, error);
                // Continue with next resource
            }
        }

        console.log(`[CRON] Completed. Added: ${addedCount}, Skipped: ${skippedCount}`);

        return NextResponse.json({
            success: true,
            resourcesDiscovered: resources.length,
            resourcesAdded: addedCount,
            resourcesSkipped: skippedCount,
        });
    } catch (error) {
        console.error('[CRON] Error discovering resources:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
