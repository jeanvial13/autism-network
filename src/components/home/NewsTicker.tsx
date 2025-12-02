"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Brain, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

const MOCK_NEWS = [
    {
        title: "Estrategias de Intervención Temprana",
        description: "Nuevos estudios confirman que la intervención antes de los 3 años mejora significativamente las habilidades sociales."
    },
    {
        title: "Tecnología Asistiva en el Aula",
        description: "Apps de comunicación aumentativa están revolucionando la inclusión educativa en escuelas primarias."
    },
    {
        title: "Avances en Genética del Autismo",
        description: "Investigadores identifican nuevos marcadores genéticos que podrían ayudar en diagnósticos más precisos."
    },
    {
        title: "Beneficios de la Terapia Ocupacional",
        description: "Cómo la integración sensorial ayuda a reducir la ansiedad y mejorar la concentración en niños."
    }
];

export function NewsTicker() {
    const t = useTranslations('home.dailyBrief');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % MOCK_NEWS.length);
        }, 25000); // 25 seconds

        return () => clearInterval(timer);
    }, []);

    const currentNews = MOCK_NEWS[currentIndex];

    return (
        <section className="py-20 relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h2>
                </div>

                <GlassCard className="border-l-4 border-l-primary overflow-hidden min-h-[200px] flex items-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col md:flex-row gap-6 items-start w-full"
                        >
                            <div className="p-4 rounded-2xl bg-secondary/10 text-secondary-foreground shrink-0">
                                <Brain className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    {currentNews.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {currentNews.description}
                                </p>
                                <Link href="/articles" className="inline-flex items-center text-primary font-medium hover:underline">
                                    {t('readUpdate')} <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </GlassCard>
            </div>
        </section>
    );
}
