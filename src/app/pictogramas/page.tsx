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
        <main className="min-h-screen pt-20 pb-4 px-2 md:px-4 bg-background">
            <div className="w-full h-full flex flex-col">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 sticky top-20 z-30 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-sm">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('title')}</h1>
                        <p className="text-sm text-muted-foreground hidden md:block">{t('subtitle')}</p>
                    </div>

                    <div className="flex gap-3">
                        <GlassButton
                            variant="primary"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="w-12 h-12 rounded-full p-0 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-600 hover:scale-110 transition-all shadow-lg hover:shadow-cyan-500/25 border-none"
                            title={t('upload')}
                        >
                            <Upload className="w-5 h-5 text-white" />
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
                            className="w-12 h-12 rounded-full p-0 flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-600 hover:scale-110 transition-all shadow-lg hover:shadow-purple-500/25 border-none"
                            title={t('generate')}
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </GlassButton>

                        <GlassButton
                            variant="primary"
                            onClick={() => setIsDeleteMode(!isDeleteMode)}
                            className={`w-12 h-12 rounded-full p-0 flex items-center justify-center transition-all shadow-lg border-none hover:scale-110 ${isDeleteMode
                                ? "bg-gradient-to-br from-red-500 to-orange-500 hover:shadow-red-500/25 ring-4 ring-red-500/30"
                                : "bg-gradient-to-br from-slate-700 to-slate-900 hover:shadow-slate-500/25"
                                }`}
                            title={isDeleteMode ? t('done') : t('delete')}
                        >
                            {isDeleteMode ? <X className="w-5 h-5 text-white" /> : <Trash2 className="w-5 h-5 text-white" />}
                        </GlassButton>
                    </div>
                </div>

                {/* Grid */}
                {pictograms.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground min-h-[50vh]">
                        <ImageIcon className="w-20 h-20 mb-4 opacity-20" />
                        <p className="text-lg">{t('noPictograms')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4 pb-20">
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
                                    <GlassCard className={`group relative aspect-square p-2 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${!isDeleteMode && 'hover:scale-105 hover:shadow-xl active:scale-95'}`}>
                                        <div className="relative w-full h-full mb-1">
                                            <NextImage
                                                src={pic.url}
                                                alt={pic.name}
                                                fill
                                                className="object-contain rounded-lg"
                                                unoptimized
                                            />
                                        </div>
                                        <p className="text-center font-bold text-sm md:text-base text-foreground capitalize truncate w-full px-1">
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
                                                    className="p-3 rounded-full bg-destructive text-white hover:scale-110 transition-transform shadow-lg"
                                                >
                                                    <Trash2 className="w-5 h-5" />
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
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-md"
                            >
                                <GlassCard className="p-6 border-white/20 shadow-2xl">
                                    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">{t('generate')}</h2>
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={t('promptPlaceholder')}
                                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 mb-6 focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg placeholder:text-white/40"
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
                                            className="bg-gradient-to-r from-violet-600 to-fuchsia-600"
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
