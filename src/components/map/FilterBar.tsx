'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassSelect } from '@/components/ui/glass-select';
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
    'Diagnóstico', 'Terapia ABA', 'Terapia de Habla', 'Terapia Ocupacional',
    'Terapia Física', 'Intervención Temprana', 'Grupos de Apoyo',
    'Investigación', 'Apoyo Familiar', 'Educación Especial'
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
    return (
        <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border z-10 transition-all duration-300">
            <div className="p-4 grid grid-cols-12 gap-4 items-end">
                {/* Services & Distance - Side by Side on Mobile, flexible on Desktop */}
                <div className="col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-[2fr_1fr] gap-4">
                    <GlassSelect
                        label={t('services')}
                        value={filters.services[0] || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            onFilterChange({ ...filters, services: val ? [val] : [] });
                        }}
                    >
                        <option value="">{t('services')} (Todos)</option>
                        {SERVICE_TYPES.map(service => (
                            <option key={service} value={service}>
                                {service}
                            </option>
                        ))}
                    </GlassSelect>

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

                {/* Verified Toggle - Full width on mobile, auto on desktop */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="relative w-full group">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-1 opacity-0 lg:opacity-100">
                            Filtro
                        </label>
                        <GlassButton
                            variant={filters.verifiedOnly ? "primary" : "outline"}
                            className={`w-full justify-between h-11 px-4 transition-all duration-300 ${filters.verifiedOnly
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 border-primary"
                                    : "bg-background/50 hover:bg-background/80 border-white/20"
                                }`}
                            onClick={() => onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                        >
                            <span className="text-sm font-medium">{t('verifiedOnly')}</span>
                            <div className={`
                                h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-300
                                ${filters.verifiedOnly ? "bg-white border-white text-primary scale-110" : "border-muted-foreground/50 text-transparent"}
                            `}>
                                <Check className="h-3 w-3" strokeWidth={3} />
                            </div>
                        </GlassButton>
                    </div>
                </div>
            </div>
        </div>
    );
    );
}
