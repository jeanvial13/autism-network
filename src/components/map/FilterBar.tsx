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
                        if (btn) btn.innerText = '🤖 Loading...';
                        try {
                            const res = await fetch('/api/ai-sourcing/populate');
                            const data = await res.json();
                            alert(JSON.stringify(data, null, 2));
                            window.location.reload();
                        } catch (e) {
                            alert('Error: ' + e);
                        } finally {
                            if (btn) btn.innerText = '⚡ Load AI Data';
                        }
                    }}
                    id="ai-btn"
                    className="ml-2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-all"
                >
                    ⚡ Load AI Data
                </button>
            </div>
        </div>
    );
}
