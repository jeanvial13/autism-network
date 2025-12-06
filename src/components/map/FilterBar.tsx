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

        const DISTANCE_OPTIONS = [5, 10, 25, 50, 100];

        export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
            const [isOpen, setIsOpen] = useState(false);
            const t = useTranslations('map.filters');

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
