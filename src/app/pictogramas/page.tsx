"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Trash2, Upload, Image as ImageIcon, Sparkles, X } from "lucide-react";
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";
import { generatePictogram } from "@/app/actions/generate-pictogram";

interface Pictogram {
    id: string;
    url: string;
    name: string;
    createdAt: number;
}

export default function PictogramasPage() {
    const t = useTranslations('pictograms');
    const [pictograms, setPictograms] = useState<Pictogram[]>([]);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [prompt, setPrompt] = useState("");

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
                        name: file.name.split('.')[0], // Remove extension for name
                        createdAt: Date.now()
                    };
                    setPictograms(prev => [newPic, ...prev]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        try {
            const imageUrl = await generatePictogram(prompt);
            const newPic: Pictogram = {
                id: Date.now().toString(),
                url: imageUrl,
                name: prompt,
                createdAt: Date.now()
            };
            setPictograms(prev => [newPic, ...prev]);
            setShowGenerateModal(false);
            setPrompt("");
        } catch (error) {
            console.error("Generation failed", error);
            alert("Error generating pictogram. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = (id: string) => {
        setPictograms(prev => prev.filter(p => p.id !== id));
    };

    const speak = (text: string) => {
        if (isDeleteMode) return;

        window.speechSynthesis.cancel(); // Stop previous speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-MX'; // Mexican Spanish preferred
        utterance.rate = 0.8; // Slower for children
        utterance.pitch = 1.1; // Slightly higher/friendlier
        window.speechSynthesis.speak(utterance);
    };

    return (
        <main className="min-h-screen pt-24 pb-20 px-4 md:px-6 bg-background">
            <div className="container mx-auto max-w-6xl">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">{t('title')}</h1>
                        <p className="text-muted-foreground">{t('subtitle')}</p>
                    </div>

                    <div className="flex gap-3">
                        <GlassButton
                            variant="secondary"
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {t('upload')}
                        </GlassButton>
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />

                        <GlassButton
                            variant="primary"
                            onClick={() => setShowGenerateModal(true)}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 border-none text-white"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {t('generate')}
                        </GlassButton>

                        <GlassButton
                            variant={isDeleteMode ? "destructive" : "outline"}
                            onClick={() => setIsDeleteMode(!isDeleteMode)}
                        >
                            {isDeleteMode ? <X className="w-4 h-4 mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            {isDeleteMode ? t('done') : t('delete')}
                        </GlassButton>
                    </div>
                </div>

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
                                    onClick={() => !isDeleteMode && speak(pic.name)}
                                    className={`cursor-pointer ${isDeleteMode ? 'cursor-default' : ''}`}
                                >
                                    <GlassCard className={`group relative aspect-square p-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${!isDeleteMode && 'hover:scale-105 hover:shadow-xl active:scale-95'}`}>
                                        <div className="relative w-full h-full mb-2">
                                            <NextImage
                                                src={pic.url}
                                                alt={pic.name}
                                                fill
                                                className="object-contain rounded-lg"
                                                unoptimized
                                            />
                                        </div>
                                        <p className="text-center font-bold text-lg text-foreground capitalize truncate w-full">
                                            {pic.name}
                                        </p>

                                        {/* Delete Overlay */}
                                        {isDeleteMode && (
                                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-10 animate-in fade-in">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(pic.id);
                                                    }}
                                                    className="p-4 rounded-full bg-destructive text-white hover:scale-110 transition-transform shadow-lg"
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                        )}
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Generate Modal */}
                <AnimatePresence>
                    {showGenerateModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full max-w-md"
                            >
                                <GlassCard className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">{t('generate')}</h2>
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={t('promptPlaceholder')}
                                        className="w-full p-4 rounded-xl bg-secondary/20 border border-border mb-6 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-3">
                                        <GlassButton variant="ghost" onClick={() => setShowGenerateModal(false)}>
                                            {t('cancel')}
                                        </GlassButton>
                                        <GlassButton
                                            variant="primary"
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !prompt.trim()}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                                    {t('generating')}
                                                </>
                                            ) : (
                                                t('generateButton')
                                            )}
                                        </GlassButton>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
