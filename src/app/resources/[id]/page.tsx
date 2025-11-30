import { MOCK_RESOURCES } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft, CheckCircle } from 'lucide-react';

export default async function ResourcePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const resource = MOCK_RESOURCES.find((r) => r.id === id);

    if (!resource) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background py-12">
            <article className="mx-auto max-w-4xl px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/resources"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Resources
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                            {resource.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{resource.credibilityScore}% Credibility Score</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                        {resource.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{resource.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{resource.date}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                    <div
                        className="text-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: resource.content
                                .split('\n')
                                .map((line) => {
                                    // Convert markdown-style headers
                                    if (line.startsWith('# ')) {
                                        return `<h1 class="text-3xl font-bold mt-8 mb-4 text-foreground">${line.substring(2)}</h1>`;
                                    }
                                    if (line.startsWith('## ')) {
                                        return `<h2 class="text-2xl font-bold mt-6 mb-3 text-foreground">${line.substring(3)}</h2>`;
                                    }
                                    if (line.startsWith('### ')) {
                                        return `<h3 class="text-xl font-semibold mt-4 mb-2 text-foreground">${line.substring(4)}</h3>`;
                                    }
                                    // Convert bold text
                                    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                    // Convert italic text
                                    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
                                    // Convert list items
                                    if (line.trim().startsWith('- ')) {
                                        return `<li class="ml-6 list-disc mb-2">${line.substring(2)}</li>`;
                                    }
                                    // Empty lines
                                    if (line.trim() === '') {
                                        return '<br/>';
                                    }
                                    return `<p class="mb-4 text-muted-foreground">${line}</p>`;
                                })
                                .join(''),
                        }}
                    />
                </div>

                {/* Navigation */}
                <div className="mt-12 flex justify-center pt-8 border-t border-border">
                    <Link href="/resources">
                        <Button variant="outline" className="rounded-full">
                            View All Resources
                        </Button>
                    </Link>
                </div>
            </article>
        </main>
    );
}
