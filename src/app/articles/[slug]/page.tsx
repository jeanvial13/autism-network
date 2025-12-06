import { notFound } from 'next/navigation';
import { CheckCircle, ExternalLink, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Fetch article from database
    let article;
    try {
        article = await prisma.article.findUnique({
            where: { slug },
            include: {
                translations: true,
            },
        });
    } catch (error) {
        console.error('Error fetching article:', error);
        article = null;
    }

    if (!article) {
        notFound();
    }

    const publishedDate = article.originalPublishedDate || article.aiGeneratedDate;
    const tags = (article.tags as string[]) || [];
    const sourceUrls = (article.sourceUrls as string[]) || [];

    // Use Spanish translation if available
    const translation = article.translations?.find((t: any) => t.language === 'es');
    const title = translation?.title || article.title;
    const tldrSummary = translation?.tldrSummary || article.tldrSummary;
    const backgroundText = translation?.backgroundText || article.backgroundText;
    const findingsText = translation?.findingsText || article.findingsText;
    const whyItMatters = translation?.whyItMatters || article.whyItMatters;
    const practicalTips = translation?.practicalTips || article.practicalTips;
    const technicalSection = translation?.technicalSection || article.technicalSection;

    return (
        <main className="min-h-screen bg-background pt-32 pb-12">
            <article className="mx-auto max-w-4xl px-6 lg:px-8">
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

                    <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>

                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="h-4 w-4" />
                            Share
                        </Button>
                    </div>

                    {/* TL;DR Removed as requested */}
                </div>

                {/* Content */}
                <div className="prose dark:prose-invert max-w-none mb-12">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Antecedentes</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {backgroundText}
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Hallazgos Clave</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {findingsText}
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Por qué importa</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {whyItMatters}
                        </p>
                    </section>

                    <Separator className="my-8" />

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Consejos Prácticos</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {practicalTips}
                        </p>
                    </section>

                    {technicalSection && (
                        <>
                            <Separator className="my-8" />
                            <details className="mb-8">
                                <summary className="text-2xl font-semibold mb-4 cursor-pointer hover:text-primary">
                                    Para Profesionales: Detalles Técnicos ▼
                                </summary>
                                <div className="mt-4 p-6 bg-muted/30 rounded-lg">
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {technicalSection}
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
                            {sourceUrls.map((url: string, idx: number) => (
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
                        {tags.map((tag: string, idx: number) => (
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
