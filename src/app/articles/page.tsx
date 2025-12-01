import { Calendar, Brain, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ArticlesPage() {
    // Fetch articles from database
    const articles = await prisma?.article.findMany({
        take: 20,
        orderBy: {
            aiGeneratedDate: 'desc'
        },
        include: {
            translations: {
                where: {
                    language: 'en'
                }
            }
        }
    }) || [];

    return (
        <main className="min-h-screen bg-background py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold text-foreground">Latest Autism Research</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Evidence-based articles updated daily. All content is scientifically reviewed, cites trusted sources,
                        and uses autism-affirming language.
                    </p>
                    {articles.length === 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>No articles yet.</strong> Run the AI generation cron job to populate articles.
                            </p>
                        </div>
                    )}
                </div>

                {/* Filters & Search */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search articles..."
                            className="pl-10 rounded-full"
                            disabled
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Topic:</span>
                        </div>
                        {['diagnosis', 'intervention', 'education', 'technology', 'inclusion'].map((t) => (
                            <Badge
                                key={t}
                                variant="outline"
                                className="capitalize opacity-50 cursor-not-allowed"
                            >
                                {t}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Audience:</span>
                        {['parents', 'professionals', 'autistic_adults', 'educators'].map((a) => (
                            <Badge
                                key={a}
                                variant="outline"
                                className="capitalize opacity-50 cursor-not-allowed"
                            >
                                {a.replace('_', ' ')}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Article List */}
                <div className="space-y-6">
                    {articles.map((article) => {
                        const daysAgo = Math.floor(
                            (Date.now() - new Date(article.aiGeneratedDate).getTime()) / (1000 * 60 * 60 * 24)
                        );
                        const isNew = daysAgo < 3;

                        return (
                            <Card
                                key={article.id}
                                className="hover:shadow-lg transition-all border-border hover:border-primary/50"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {isNew && (
                                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">NEW</Badge>
                                            )}
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                {article.credibilityScore}% Credibility
                                            </Badge>
                                            <Badge variant="secondary">{article.evidenceType}</Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {daysAgo === 0
                                                    ? 'Today'
                                                    : daysAgo === 1
                                                        ? 'Yesterday'
                                                        : `${daysAgo} days ago`}
                                            </span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl mb-2">{article.title}</CardTitle>
                                    <CardDescription className="text-muted-foreground text-base leading-relaxed">
                                        <strong>TL;DR:</strong> {article.tldrSummary}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {article.topics.slice(0, 3).map((topic, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                                {topic}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-muted-foreground">
                                            Source: <span className="font-medium text-foreground">{article.sourceName}</span>
                                        </p>
                                        <Link href={`/articles/${article.slug}`}>
                                            <Button variant="default" className="rounded-full">
                                                Read Full Article
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Disclaimer */}
                <div className="mt-12 rounded-2xl bg-muted/30 p-6 border border-border">
                    <div className="flex items-start gap-3">
                        <Brain className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">For Informational Purposes Only</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                This platform provides information only, not medical advice. Articles are AI-generated summaries
                                of peer-reviewed research and are reviewed for scientific accuracy. Always consult a qualified
                                healthcare professional for medical decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
