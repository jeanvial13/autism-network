import { NextRequest, NextResponse } from 'next/server';
import { validateResourceLink } from '@/lib/ai/resource-discovery';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * Link Validation Cron Job
 * 
 * Schedule: Monthly
 * 
 * Validates all resource links and marks dead ones
 */
export async function GET(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const url = new URL(request.url);
    const secretParam = url.searchParams.get('secret');
    const secret = process.env.CRON_SECRET || process.env.NEXTAUTH_SECRET;

    if (authHeader !== `Bearer ${secret}` && secretParam !== secret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON] Starting link validation...');

    try {
        // Get all active resources
        const resources = await prisma.educationalResource.findMany({
            where: {
                status: { in: ['ACTIVE', 'PENDING'] },
            },
        });

        console.log(`[CRON] Validating ${resources.length} resources...`);

        let validCount = 0;
        let deadCount = 0;

        for (const resource of resources) {
            try {
                const isValid = await validateResourceLink(resource.url);

                if (isValid) {
                    // Update last checked date
                    await prisma.educationalResource.update({
                        where: { id: resource.id },
                        data: {
                            lastCheckedDate: new Date(),
                            deadLink: false,
                        },
                    });
                    validCount++;
                } else {
                    // Mark as unavailable
                    await prisma.educationalResource.update({
                        where: { id: resource.id },
                        data: {
                            status: 'UNAVAILABLE',
                            deadLink: true,
                            lastCheckedDate: new Date(),
                        },
                    });
                    deadCount++;
                    console.log(`[CRON] Dead link: ${resource.url}`);
                }
            } catch (error) {
                console.error(`[CRON] Error validating ${resource.url}:`, error);
            }

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log(`[CRON] Validation complete. Valid: ${validCount}, Dead: ${deadCount}`);

        return NextResponse.json({
            success: true,
            totalChecked: resources.length,
            valid: validCount,
            dead: deadCount,
        });
    } catch (error) {
        console.error('[CRON] Error validating links:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
