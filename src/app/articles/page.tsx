import { Calendar, Brain, Filter, Search } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassPill } from '@/components/ui/glass-pill';
import { GlassSelect } from '@/components/ui/glass-select';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { ArticleGenerator } from '@/components/articles/ArticleGenerator';

export default async function ArticlesPage() {
    const t = await getTranslations('articles');

    // Fetch articles from database
    let articles: any[] = [];

    try {
        if (prisma) {
            articles = await prisma.article.findMany({
                take: 20,
                orderBy: {
                    aiGeneratedDate: 'desc'
                },
                include: {
                    translations: {
                        where: {
                            language: 'es' // Prefer Spanish translations if available
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Failed to fetch articles:', error);
    }

    return (
        <main className="min-h-screen bg-background py-12 pt-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <Calendar className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                        {t('subtitle')}
                    </p>
                    {articles.length === 0 && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>{t('noArticles.title')}</strong> {t('noArticles.description')}
                            </p>
                        </div>
                    )}
                </div>

                {/* AI Generator */}
                <ArticleGenerator />

                {/* Article List */}
                <div className="space-y-6">
                    {articles.map((article) => {
                        const daysAgo = Math.floor(
                            (Date.now() - new Date(article.aiGeneratedDate).getTime()) / (1000 * 60 * 60 * 24)
                        );
                        const isNew = daysAgo < 3;

                        // Use Spanish translation if available, fallback to English
                        const title = article.translations?.[0]?.title || article.title;
                        const summary = article.translations?.[0]?.tldrSummary || article.tldrSummary;

                        return (
                            <GlassCard
                                key={article.id}
                                className="hover:border-primary/50 transition-all duration-300"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-start justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {isNew && (
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                                                    {t('card.new')}
                                                </Badge>
                                            )}
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                {article.credibilityScore}% {t('card.credibility')}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                                                {article.evidenceType}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground ml-2">
                                                {daysAgo === 0
                                                    ? t('card.today')
                                                    : daysAgo === 1
                                                        ? t('card.yesterday')
                                                        : t('card.daysAgo', { days: daysAgo })}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold mb-3 text-foreground">{title}</h2>
                                        <div className="space-y-3">
                                            <div className="text-muted-foreground text-base leading-relaxed bg-white/40 dark:bg-black/20 p-4 rounded-xl border border-white/10">
                                                <strong className="text-foreground block mb-1">💡 {t('card.tldr')}</strong>
                                                {summary}
                                            </div>

                                            {/* Show more details on the card */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                                    <strong className="text-blue-700 dark:text-blue-300 block mb-1">🎯 {t('card.whyItMatters') || 'Por qué importa'}</strong>
                                                    <p className="line-clamp-2 text-muted-foreground">
                                                        {article.translations?.[0]?.whyItMatters || article.whyItMatters}
                                                    </p>
                                                </div>
                                                <div className="bg-purple-50/50 dark:bg-purple-900/10 p-3 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                                    <strong className="text-purple-700 dark:text-purple-300 block mb-1">🔍 {t('card.findings') || 'Hallazgos Clave'}</strong>
                                                    <p className="line-clamp-2 text-muted-foreground">
                                                        {article.translations?.[0]?.findingsText || article.findingsText}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {article.topics.slice(0, 3).map((topic: string, idx: number) => (
                                            <Badge key={idx} variant="outline" className="text-xs bg-transparent border-border/50">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/30">
                                        <p className="text-sm text-muted-foreground">
                                            {t('card.source')} <span className="font-medium text-foreground">{article.sourceName}</span>
                                        </p>
                                        <Link href={`/articles/${article.slug}`}>
                                            <GlassButton variant="primary" size="sm" className="rounded-full px-6">
                                                {t('card.readFull')}
                                            </GlassButton>
                                        </Link>
                                    </div>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>

                {/* Disclaimer */}
                <div className="mt-12 rounded-2xl bg-muted/30 p-6 border border-border/50 backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-background/50">
                            <Brain className="h-6 w-6 text-primary flex-shrink-0" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">{t('disclaimer.title')}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {t('disclaimer.text')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
