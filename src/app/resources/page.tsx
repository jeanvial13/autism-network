import { Download, Filter, Search, FileText, Image, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';

export default async function ResourcesPage() {
    // Fetch resources from database
    const resources = await prisma?.educationalResource.findMany({
        take: 50,
        orderBy: {
            lastCheckedDate: 'desc'
        }
    }) || [];

    const getFileIcon = (fileType: string) => {
        if (fileType === 'PDF') return FileText;
        if (fileType === 'image') return Image;
        return BookOpen;
    };

    return (
        <main className="min-h-screen bg-background py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Download className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl font-bold text-foreground">Free Autism Toolbox</h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Free downloadable worksheets, visual schedules, social stories, communication boards, and activities.
                        All resources are curated for autism support.
                    </p>
                    {resources.length === 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>No resources yet.</strong> Run the resource discovery cron job to populate resources.
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
                            placeholder="Search resources..."
                            className="pl-10 rounded-full"
                            disabled
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Topic:</span>
                        </div>
                        {[
                            'communication',
                            'social_skills',
                            'sensory',
                            'academic',
                            'behavior_support',
                            'daily_living',
                        ].map((t) => (
                            <Badge
                                key={t}
                                variant="outline"
                                className="capitalize opacity-50 cursor-not-allowed"
                            >
                                {t.replace('_', ' ')}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Age:</span>
                        {['early_childhood', 'elementary', 'teens', 'adults'].map((a) => (
                            <Badge
                                key={a}
                                variant="outline"
                                className="capitalize opacity-50 cursor-not-allowed"
                            >
                                {a.replace('_', ' ')}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Format:</span>
                        {['worksheet', 'visual_schedule', 'social_story', 'coloring', 'guide'].map((f) => (
                            <Badge
                                key={f}
                                variant="outline"
                                className="capitalize opacity-50 cursor-not-allowed"
                            >
                                {f.replace('_', ' ')}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource) => {
                        const FileIcon = getFileIcon(resource.fileType || 'PDF');

                        return (
                            <Card
                                key={resource.id}
                                className="hover:shadow-lg transition-all border-border hover:border-primary/50 flex flex-col"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <FileIcon className="h-6 w-6 text-primary" />
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            Recently Verified
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                                    <CardDescription className="text-sm line-clamp-3">
                                        {resource.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {resource.topics.slice(0, 2).map((topic, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {topic.replace('_', ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                        <div className="text-xs text-muted-foreground space-y-1">
                                            <div>Age: {resource.targetAge.join(', ').replace(/_/g, ' ')}</div>
                                            <div>Format: {resource.fileType || 'PDF'}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button className="w-full rounded-full" size="sm">
                                                <Download className="mr-2 h-4 w-4" />
                                                {resource.isDownloadable ? 'Download' : 'View Resource'}
                                            </Button>
                                        </a>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        Free external resource • Check license on site
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Disclaimer */}
                <div className="mt-12 rounded-2xl bg-muted/30 p-6 border border-border">
                    <div className="flex items-start gap-3">
                        <Download className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-semibold mb-2 text-foreground">About These Resources</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                All resources are curated from trusted external sources and are free to access. We verify links
                                regularly, but please check the license on the original site before commercial use. These materials
                                are intended to support education, therapy, and daily living skills for autistic individuals and their
                                families.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
