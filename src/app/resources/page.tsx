import { Download, Filter, Search, FileText, Image, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassPill } from '@/components/ui/glass-pill';
import { GlassSelect } from '@/components/ui/glass-select';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';

// Removed Search and Filters as per user request
import { ResourceGenerator } from '@/components/resources/ResourceGenerator';

export default async function ResourcesPage() {
    const t = await getTranslations('resources');

    // Fetch resources from database (Limit increased to show more results)
    let resources: any[] = [];

    try {
        if (prisma) {
            resources = await prisma.educationalResource.findMany({
                take: 100,
                orderBy: {
                    createdAt: 'desc' // Newest first
                }
            });
        }
    } catch (error) {
        console.error('Failed to fetch resources:', error);
    }

    const getFileIcon = (fileType: string) => {
        if (fileType === 'PDF') return FileText;
        if (fileType === 'image') return Image;
        return BookOpen;
    };

    return (
        <main className="min-h-screen bg-background py-12 pt-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center">

                    <h1 className="text-4xl font-bold text-foreground mb-4">{t('title')}</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                        {t('subtitle')}
                    </p>

                    {/* Auto-Generate AI Button */}
                    <ResourceGenerator />

                    {resources.length === 0 && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>{t('noResources.title')}</strong> {t('noResources.description')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => {
                        const FileIcon = getFileIcon(resource.fileType || 'PDF');

                        return (
                            <GlassCard
                                key={resource.id}
                                className="hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <FileIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary-foreground border-none">
                                            {t('card.recentlyVerified')}
                                        </Badge>
                                    </div>

                                    <h3 className="text-lg font-bold line-clamp-2 mb-2 text-foreground">{resource.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                        {resource.description}
                                    </p>

                                    <div className="mt-auto">
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {resource.topics.slice(0, 2).map((topic: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-xs border-border/50">
                                                    {topic.replace('_', ' ')}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="text-xs text-muted-foreground space-y-1 mb-4 p-3 rounded-lg bg-white/30 dark:bg-black/10">
                                            <div className="flex justify-between">
                                                <span>{t('card.age')}</span>
                                                <span className="font-medium">{resource.targetAge.join(', ').replace(/_/g, ' ')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{t('card.format')}</span>
                                                <span className="font-medium">{resource.fileType || 'PDF'}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1"
                                            >
                                                <GlassButton variant="primary" size="sm" className="w-full rounded-full">
                                                    <Download className="mr-2 h-4 w-4" />
                                                    {resource.isDownloadable ? t('card.download') : t('card.view')}
                                                </GlassButton>
                                            </a>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground mt-2 text-center opacity-70">
                                            {t('card.license')}
                                        </p>
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
                            <Download className="h-6 w-6 text-primary flex-shrink-0" />
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
