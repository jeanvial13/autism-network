import { notFound } from 'next/navigation';
import { Calendar, CheckCircle, ExternalLink, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Mock data until database is migrated
const MOCK_ARTICLES: Record<string, any> = {
    'early-intervention-outcomes-2025': {
        id: '1',
        slug: 'early-intervention-outcomes-2025',
        title: 'New Study Shows Early Intervention Improves Outcomes in 90% of Cases',
        tldrSummary: 'Researchers from Stanford University found that children who received intervention before age 3 showed significant improvements in communication and social skills.',
        backgroundText: 'A comprehensive 5-year longitudinal study at Stanford University examined the effects of early intervention on autism spectrum disorder. The research team followed 1,200 children aged 18-36 months who received various types of intervention including ABA, ESDM, and JASPER approaches.',
        findingsText: 'The study found that 90% of children who received intervention before age 3 showed:\n\n• 85% improvement in expressive language skills\n• 78% increase in peer engagement and social interaction\n• 82% better performance in daily living skills\n• Significant reduction in challenging behaviors\n\nChildren in the early intervention group (before 24 months) consistently outperformed those who started later.',
        whyItMatters: 'This research provides strong evidence for the importance of early screening and intervention. Parents and healthcare providers should prioritize early assessment and access to evidence-based interventions. Early intervention can lead to better long-term outcomes and improved quality of life for autistic children and their families.',
        practicalTips: '1. Schedule developmental screenings at 18 and 24 months\n2. Trust your instincts - if you notice developmental differences, seek evaluation\n3. Research evidence-based interventions in your area\n4. Connect with other parents through support groups\n5. Work with your pediatrician to create an intervention plan\n6. Document progress to track improvements over time',
        technicalSection: 'The study employed a randomized controlled trial design with three groups: early intervention (n=400, mean age 21 months), standard intervention (n=400, mean age 30 months), and control group (n=400). Intervention intensity ranged from 15-25 hours per week. Outcomes were measured using standardized assessments including ADOS-2, Vineland-3, and Mullen Scales. Statistical analysis revealed significant differences (p<0.001) across all measured domains.',
        tags: ['early intervention', 'research', 'outcomes', 'Stanford', 'longitudinal study'],
        topics: ['intervention', 'early_childhood', 'research'],
        audience: ['parents', 'professionals'],
        evidenceType: 'RCT',
        sourceUrls: ['https://example.com/stanford-study'],
        sourceName: 'Journal of Autism and Developmental Disorders',
        credibilityScore: 95,
        aiGeneratedDate: new Date('2025-11-29'),
        originalPublishedDate: new Date('2025-11-15'),
    },
};

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = MOCK_ARTICLES[slug];

    if (!article) {
        notFound();
    }

    const publishedDate = article.originalPublishedDate || article.aiGeneratedDate;

    return (
        <main className="min-h-screen bg-background py-12">
            <article className="mx-auto max-w-4xl px-6 lg:px-8">
                {/* Demo Mode Banner */}
                <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Demo Mode:</strong> This is sample content. Run database migration for real articles.
                    </p>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {Math.floor((Date.now() - new Date(article.aiGeneratedDate).getTime()) / (1000 * 60 * 60 * 24)) < 7 && (
                            <Badge className="bg-blue-100 text-blue-700">NEW</Badge>
                        )}
                        <Badge variant="default" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {article.credibilityScore}% Credibility
                        </Badge>
                        <Badge variant="secondary">{article.evidenceType}</Badge>
                        <span className="text-sm text-muted-foreground">
                            Published {new Date(publishedDate).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold text-foreground mb-4">{article.title}</h1>

                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Share
                        </Button>
                    </div>

                    {/* TL;DR Box */}
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 p-6">
                        <h2 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">TL;DR</h2>
                        <p className="text-blue-800 dark:text-blue-200 leading-relaxed">{article.tldrSummary}</p>
                    </Card>
                </div>

                {/* Content */}
                <div className="prose dark:prose-invert max-w-none mb-12">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Background</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {article.backgroundText}
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Key Findings</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {article.findingsText}
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Why This Matters</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {article.whyItMatters}
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Practical Tips</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {article.practicalTips}
                        </p>
                    </section>

                    {article.technicalSection && (
                        <>
                            <Separator className="my-8" />
                            <details className="mb-8">
                                <summary className="text-2xl font-semibold mb-4 cursor-pointer hover:text-primary">
                                    For Professionals: Technical Details ▼
                                </summary>
                                <div className="mt-4 p-6 bg-muted/30 rounded-lg">
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {article.technicalSection}
                                    </p>
                                </div>
                            </details>
                        </>
                    )}
                </div>

                {/* References */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">References</h2>
                    <Card className="p-6">
                        <ul className="space-y-3">
                            {article.sourceUrls.map((url: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <ExternalLink className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline break-all"
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Tags */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <Card className="bg-muted/30 p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute
                        medical or professional advice. Always consult with qualified healthcare providers for personalized
                        guidance and treatment decisions.
                    </p>
                </Card>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link href="/articles">
                        <Button variant="outline">← Back to Articles</Button>
                    </Link>
                </div>
            </article>
        </main>
    );
}
