import { NextRequest, NextResponse } from 'next/server';
import { discoverAutismContent } from '@/lib/ai/content-discovery';
import { generateArticle, generateEmbedding, createEmbeddingText, validateArticle } from '@/lib/ai/article-generator';
import { translateArticleMultiple, getSupportedLanguages } from '@/lib/ai/translator';
import { classifyContent } from '@/lib/ai/safety-classifier';
import { prisma } from '@/lib/prisma';

/**
 * Daily Article Generation Cron Job
 * 
 * Schedule: Daily at 2:00 AM UTC
 * 
 * Steps:
 * 1. Discover recent autism research
 * 2. Generate comprehensive articles
 * 3. Run safety classification
 * 4. Translate to supported languages
 * 5. Generate vector embeddings
 * 6. Save to database
 */
export async function GET(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON] Starting daily article generation...');

    try {
        // Step 1: Discover content
        console.log('[CRON] Discovering research findings...');
        const findings = await discoverAutismContent();
        console.log(`[CRON] Found ${findings.length} research findings`);

        if (findings.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No new findings discovered',
                articlesGenerated: 0,
            });
        }

        // Step 2: Cluster findings (for now, take top 5)
        const topFindings = findings.slice(0, 5);

        // Step 3: Generate article
        console.log('[CRON] Generating article...');
        const article = await generateArticle(topFindings);

        // Step 4: Validate article
        const validation = validateArticle(article);
        if (!validation.valid) {
            console.error('[CRON] Article validation failed:', validation.errors);
            return NextResponse.json({
                success: false,
                error: 'Generated article failed validation',
                details: validation.errors,
            }, { status: 500 });
        }

        // Step 5: Safety classification
        console.log('[CRON] Running safety classification...');
        const safetyCheck = await classifyContent(
            article.title,
            article.sourceName || 'Multiple sources',
            article.backgroundText + '\n' + article.findingsText
        );

        if (safetyCheck.verdict === 'REJECT') {
            console.log('[CRON] Article rejected by safety classifier:', safetyCheck.reason);
            return NextResponse.json({
                success: true,
                message: 'Article rejected by safety filter',
                reason: safetyCheck.reason,
            });
        }

        // Step 6: Generate embedding
        console.log('[CRON] Generating embedding...');
        const embeddingText = createEmbeddingText(article);
        const embedding = await generateEmbedding(embeddingText);

        // Step 7: Save article to database
        console.log('[CRON] Saving article to database...');
        const status = safetyCheck.verdict === 'APPROVE' ? 'APPROVED' : 'PENDING';

        const savedArticle = await prisma.article.create({
            data: {
                slug: article.slug,
                title: article.title,
                tldrSummary: article.tldrSummary,
                backgroundText: article.backgroundText,
                findingsText: article.findingsText,
                whyItMatters: article.whyItMatters,
                practicalTips: article.practicalTips,
                technicalSection: article.technicalSection,
                tags: article.tags,
                topics: article.topics,
                audience: article.audience,
                ageGroups: article.ageGroups,
                evidenceType: article.evidenceType,
                sourceUrls: article.sourceUrls,
                sourceName: article.sourceName,
                originalPublishedDate: article.originalPublishedDate,
                credibilityScore: safetyCheck.credibilityScore,
                status,
                flaggedReason: safetyCheck.verdict === 'FLAG_FOR_REVIEW' ? safetyCheck.reason : undefined,
                embedding: embedding as any, // pgvector type
            } as any,
        });

        console.log(`[CRON] Article saved with ID: ${savedArticle.id}`);

        // Step 8: Translate to supported languages
        console.log('[CRON] Translating article...');
        const languages = getSupportedLanguages().filter(lang => lang !== 'en');
        const translations = await translateArticleMultiple(article, languages);

        for (const translation of translations) {
            await prisma.articleTranslation.create({
                data: {
                    articleId: savedArticle.id,
                    language: translation.language,
                    title: translation.title,
                    tldrSummary: translation.tldrSummary,
                    backgroundText: translation.backgroundText,
                    findingsText: translation.findingsText,
                    whyItMatters: translation.whyItMatters,
                    practicalTips: translation.practicalTips,
                    technicalSection: translation.technicalSection,
                },
            });
        }

        console.log(`[CRON] Translated to ${translations.length} languages`);

        return NextResponse.json({
            success: true,
            articleId: savedArticle.id,
            slug: savedArticle.slug,
            status,
            translations: translations.length,
            credibilityScore: safetyCheck.credibilityScore,
        });
    } catch (error) {
        console.error('[CRON] Error generating articles:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
