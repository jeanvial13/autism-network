'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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
                    <Button
                        variant={isOpen ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {(filters.services.length > 0 || filters.verifiedOnly) && (
                            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                                {filters.services.length + (filters.verifiedOnly ? 1 : 0)}
                            </Badge>
                        )}
                    </Button>

                    <div className="h-6 w-px bg-border mx-2" />

                    {/* Quick Filters */}
                    <Button
                        variant={filters.verifiedOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                        className="rounded-full"
                    >
                        {filters.verifiedOnly && <Check className="mr-1 h-3 w-3" />}
                        Verified Only
                    </Button>

                    {DISTANCE_OPTIONS.map(dist => (
                        <Button
                            key={dist}
                            variant={filters.distance === dist ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => onFilterChange({ ...filters, distance: dist })}
                            className="rounded-full text-xs"
                        >
                            {dist} km
                        </Button>
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
                                    <h4 className="text-sm font-medium mb-2">Services</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {SERVICE_TYPES.map(service => (
                                            <Badge
                                                key={service}
                                                variant={filters.services.includes(service) ? "default" : "outline"}
                                                className="cursor-pointer hover:bg-primary/90 transition-colors py-1.5 px-3"
                                                onClick={() => toggleService(service)}
                                            >
                                                {service}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onFilterChange({ services: [], verifiedOnly: false, distance: 50 })}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
