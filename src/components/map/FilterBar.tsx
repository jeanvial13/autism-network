'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Check } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassPill } from '@/components/ui/glass-pill';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface FilterBarProps {
    filters: {
        services: string[];
        verifiedOnly: boolean;
        distance: number;
    };
    onFilterChange: (filters: any) => void;
}

const SERVICE_TYPES = [
    'Diagnosis', 'ABA Therapy', 'Speech Therapy', 'Occupational Therapy',
    'Physical Therapy', 'Early Intervention', 'Support Groups',
    'Research', 'Family Support', 'Education'
];

const DISTANCE_OPTIONS = [5, 10, 25, 50, 100];

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('map.filters');

    const toggleService = (service: string) => {
        const newServices = filters.services.includes(service)
            ? filters.services.filter(s => s !== service)
            : [...filters.services, service];
        onFilterChange({ ...filters, services: newServices });
    };

    return (
        <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-10">
            <div className="p-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    <GlassButton
                        variant={isOpen ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 h-9"
                    >
                        <Filter className="h-4 w-4" />
                        {t('title')}
                        {(filters.services.length > 0 || filters.verifiedOnly) && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px] bg-white/20 text-white">
                                {filters.services.length + (filters.verifiedOnly ? 1 : 0)}
                            </Badge>
                        )}
                    </GlassButton>

                    <div className="h-6 w-px bg-border mx-2" />

                    {/* Quick Filters */}
                    <GlassPill
                        active={filters.verifiedOnly}
                        onClick={() => onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                    >
                        {filters.verifiedOnly && <Check className="mr-1 h-3 w-3 inline" />}
                        {t('verifiedOnly')}
                    </GlassPill>

                    {DISTANCE_OPTIONS.map(dist => (
                        <GlassPill
                            key={dist}
                            active={filters.distance === dist}
                            onClick={() => onFilterChange({ ...filters, distance: dist })}
                        >
                            {dist} km
                        </GlassPill>
                    ))}
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="py-4 space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">{t('services')}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {SERVICE_TYPES.map(service => (
                                            <GlassPill
                                                key={service}
                                                active={filters.services.includes(service)}
                                                onClick={() => toggleService(service)}
                                            >
                                                {service}
                                            </GlassPill>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <GlassButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onFilterChange({ services: [], verifiedOnly: false, distance: 50 })}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {t('reset')}
                                    </GlassButton>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
