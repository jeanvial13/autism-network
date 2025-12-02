"use client";

"use client";

import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassCard } from "@/components/ui/glass-card";
import { FloatingGlassOrbs } from "@/components/ui/floating-glass-orbs";
import { MapPin, BookOpen, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export function HeroSection() {
    const t = useTranslations('home.hero');

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/10" />
            <FloatingGlassOrbs />

            <div className="container relative z-10 px-4 md:px-6 flex flex-col lg:flex-row items-center gap-12">
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                            {t('title1')}
                            <span className="block text-primary mt-2">
                                {t('title2')}
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {t('subtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/map">
                                <GlassButton variant="primary" size="lg" className="w-full sm:w-auto">
                                    <MapPin className="w-5 h-5" />
                                    {t('findSupport')}
                                </GlassButton>
                            </Link>
                            <Link href="/resources">
                                <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
                                    <BookOpen className="w-5 h-5" />
                                    {t('exploreResources')}
                                </GlassButton>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground"
                    >
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">{t('trust.families')}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="text-sm font-medium">{t('trust.countries')}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Cards Preview (Desktop) */}
                <div className="hidden lg:block flex-1 relative h-[600px] w-full max-w-[600px]">
                    {/* Card 1: Map Preview */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-10 z-20"
                    >
                        <GlassCard className="w-72 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border-white/40">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{t('cards.specialists.title')}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {t('cards.specialists.subtitle')}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 h-24 rounded-lg bg-black/5 dark:bg-white/5 w-full overflow-hidden relative">
                                {/* Mock Map UI */}
                                <div className="absolute inset-0 bg-[url('/map-pattern.svg')] opacity-20" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute" />
                                    <div className="w-3 h-3 bg-primary rounded-full relative" />
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Card 2: Resource Preview */}
                    <motion.div
                        animate={{ y: [0, 25, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-20 left-10 z-10"
                    >
                        <GlassCard className="w-80 backdrop-blur-lg bg-white/30 dark:bg-slate-900/30 border-white/30">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground border border-secondary/20">
                                    {t('cards.article.tag')}
                                </span>
                                <span className="text-xs text-muted-foreground">{t('cards.article.readTime')}</span>
                            </div>
                            <h3 className="font-semibold text-lg leading-tight mb-2">
                                {t('cards.article.title')}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {t('cards.article.subtitle')}
                            </p>
                            <div className="flex items-center text-primary text-sm font-medium">
                                {t('cards.article.readMore')} <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
