'use client';

import { useState } from 'react';
import { GlassSelect } from '@/components/ui/glass-select';

interface FilterBarProps {
    filters: {
        distance: number;
    };
    onFilterChange: (filters: any) => void;
}

const DISTANCE_OPTIONS = [5, 10, 25, 50, 100];

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
                        <option value="20000">Global</option>
                        {DISTANCE_OPTIONS.map(dist => (
                            <option key={dist} value={dist}>
                                {dist} km
                            </option>
                        ))}
                    </GlassSelect>
                </div>
            </div>
        </div>
    );
}
