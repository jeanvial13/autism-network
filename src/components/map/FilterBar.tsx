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
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassSelect
                    label={t('services')}
                    value={filters.services[0] || ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        onFilterChange({ ...filters, services: val ? [val] : [] });
                    }}
                >
                    <option value="">{t('services')} (All)</option>
                    {SERVICE_TYPES.map(service => (
                        <option key={service} value={service}>
                            {service}
                        </option>
                    ))}
                </GlassSelect>

                <GlassSelect
                    label="Distance"
                    value={filters.distance}
                    onChange={(e) => onFilterChange({ ...filters, distance: Number(e.target.value) })}
                >
                    {DISTANCE_OPTIONS.map(dist => (
                        <option key={dist} value={dist}>
                            {dist} km
                        </option>
                    ))}
                </GlassSelect>

                <div className="flex items-end">
                    <GlassButton
                        variant={filters.verifiedOnly ? "primary" : "outline"}
                        className="w-full justify-center"
                        onClick={() => onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                    >
                        {filters.verifiedOnly && <Check className="mr-2 h-4 w-4" />}
                        {t('verifiedOnly')}
                    </GlassButton>
                </div>
            </div>
        </div>
    );
}
