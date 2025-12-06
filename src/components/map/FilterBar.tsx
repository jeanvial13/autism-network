'use client';

import { useState } from 'react';
import { GlassSelect } from '@/components/ui/glass-select';

interface FilterBarProps {
    filters: {
        distance: number;
    };
    onFilterChange: (filters: any) => void;
}

const DISTANCE_OPTIONS = [5, 10, 25, 50, 100, 1000, 5000];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
    return (
        <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-10 transition-all duration-300">
            <div className="p-4 flex justify-end">
                <div className="w-full sm:w-48">
                    <GlassSelect
                        label="Distancia"
                        value={filters.distance}
                        onChange={(e) => onFilterChange({ ...filters, distance: Number(e.target.value) })}
                    >
                        <option value="20000">Global (Todo el Mundo)</option>
                        {DISTANCE_OPTIONS.map(dist => (
                            <option key={dist} value={dist}>
                                {dist} km
                            </option>
                        ))}
                    </GlassSelect>
                </div>
                <button
                    onClick={async () => {
                        const btn = document.getElementById('ai-btn');
                        if (!btn) return;

                        // Loading State: Disable & Visual Feedback
                        const originalText = btn.innerText;
                        btn.innerText = '⚙️ Sincronizando...';
                        btn.style.opacity = '0.7';
                        btn.setAttribute('disabled', 'true');

                        try {
                            const res = await fetch('/api/ai-sourcing/populate');

                            if (res.ok) {
                                // Success State: Green & Checkmark
                                btn.innerText = '✅ ¡Sincronizado!';
                                btn.classList.remove('from-indigo-500', 'to-purple-600');
                                btn.classList.add('bg-green-500', 'from-green-500', 'to-green-600');

                                // Auto-reload to show results
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1500);
                            } else {
                                throw new Error('Error en API');
                            }
                        } catch (e) {
                            console.error(e);
                            btn.innerText = '❌ Error';
                            // Fallback
                            setTimeout(() => {
                                btn.innerText = originalText;
                                btn.style.opacity = '1';
                                btn.removeAttribute('disabled');
                            }, 2000);
                        }
                    }}
                    id="ai-btn"
                    className="ml-2 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                >
                    ✨ Sincronizar IA
                </button>
            </div>
        </div>
    );
}
