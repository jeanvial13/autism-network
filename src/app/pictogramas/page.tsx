"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Plus, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";

interface Pictogram {
    id: string;
    url: string;
    name: string;
    createdAt: number;
}
// ... (rest of file)
// Inside component:


export default function PictogramasPage() {
    const t = useTranslations('pictograms');
    const [pictograms, setPictograms] = useState<Pictogram[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('user_pictograms');
        if (saved) {
            try {
                setPictograms(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load pictograms", e);
            }
        }
    }, []);

    // Save to localStorage whenever pictograms change
    useEffect(() => {
        localStorage.setItem('user_pictograms', JSON.stringify(pictograms));
    }, [pictograms]);

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    const newPic: Pictogram = {
                        id: Date.now().toString() + Math.random().toString(),
                        url: result,
                        name: file.name,
                        createdAt: Date.now()
                    };
                    setPictograms(prev => [newPic, ...prev]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDelete = (id: string) => {
        setPictograms(prev => prev.filter(p => p.id !== id));
    };

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 md:px-6 bg-background">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">{t('title')}</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Upload Area */}
                <GlassCard className={`mb-12 border-2 border-dashed transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div
                        className="flex flex-col items-center justify-center py-12 cursor-pointer"
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            handleFileUpload(e.dataTransfer.files);
                        }}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                            <Upload className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{t('upload')}</h3>
                        <p className="text-muted-foreground mb-6">{t('dragDrop')}</p>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />
                        <GlassButton size="sm" variant="secondary">
                            <Plus className="w-4 h-4 mr-2" />
                            {t('upload')}
                        </GlassButton>
                    </div>
                </GlassCard>

                {/* Grid */}
                {pictograms.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>{t('noPictograms')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <AnimatePresence>
                            {pictograms.map((pic) => (
                                <motion.div
                                    key={pic.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <GlassCard className="group relative aspect-square p-2 flex items-center justify-center overflow-hidden">
                                        <div className="relative w-full h-full">
                                            <NextImage
                                                src={pic.url}
                                                alt={pic.name}
                                                fill
                                                className="object-contain rounded-lg"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <button
                                                onClick={() => handleDelete(pic.id)}
                                                className="p-3 rounded-full bg-destructive text-white hover:scale-110 transition-transform"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </main>
    );
}
