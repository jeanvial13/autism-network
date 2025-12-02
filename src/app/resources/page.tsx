import { Download, Filter, Search, FileText, Image, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassPill } from '@/components/ui/glass-pill';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';

export default async function ResourcesPage() {
    const t = await getTranslations('resources');

    // Fetch resources from database
    let resources = [];

    try {
        if (prisma) {
            resources = await prisma.educationalResource.findMany({
                take: 50,
                orderBy: {
                    lastCheckedDate: 'desc'
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
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <Download className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
                        {t('subtitle')}
                    </p>
                    {resources.length === 0 && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>{t('noResources.title')}</strong> {t('noResources.description')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            className="pl-10 rounded-full bg-white/50 border-white/20 focus:bg-white transition-all h-12"
                            disabled
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2 mr-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{t('filters.topic')}</span>
                        </div>
                        {[
                            'communication',
                            'social_skills',
                            'sensory',
                            'academic',
                            'behavior_support',
                            'daily_living',
                        ].map((topic) => (
                            <GlassPill key={topic} active={false} className="opacity-50 cursor-not-allowed">
                                {topic.replace('_', ' ')}
                            </GlassPill>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-sm font-medium mr-2">{t('filters.age')}</span>
                        {['early_childhood', 'elementary', 'teens', 'adults'].map((age) => (
                            <GlassPill key={age} active={false} className="opacity-50 cursor-not-allowed">
                                {age.replace('_', ' ')}
                            </GlassPill>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-sm font-medium mr-2">{t('filters.format')}</span>
                        {['worksheet', 'visual_schedule', 'social_story', 'coloring', 'guide'].map((format) => (
                            <GlassPill key={format} active={false} className="opacity-50 cursor-not-allowed">
                                {format.replace('_', ' ')}
                            </GlassPill>
                        ))}
                    </div>
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
