'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterBar from '@/components/map/FilterBar';
import ProviderCard from '@/components/map/ProviderCard';
import ProviderDetail from '@/components/map/ProviderDetail';
import MapboxMap from '@/components/map/MapboxMap';
import { useRobustGeolocation, calculateDistance } from '@/lib/geolocation';
import { useTranslations } from 'next-intl';

interface MapClientProps {
    providers: Array<{
        id: string | number;
        name: string;
        city: string;
        lat: number;
        lng: number;
        services: string[];
        verified: boolean;
        image: string;
    }>;
}

export default function MapClient({ providers }: MapClientProps) {
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [filters, setFilters] = useState({
        distance: 50 // Default to "Near Me" (50 km)
    });

    const userLocation = useRobustGeolocation(); // Uses robust 3-layer logic
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    const t = useTranslations('map');



    // Filter and Sort Providers
    const filteredProviders = useMemo(() => {
        let result = providers.filter(center => {
            // Distance Filter (if user location available)
            let matchesDistance = true;
            if (userLocation.latitude && userLocation.longitude) {
                const dist = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    center.lat,
                    center.lng
                );
                matchesDistance = dist <= filters.distance;
            }

            return matchesDistance;
        });

        // Sort Providers
        result.sort((a, b) => {
            // 1. Verified First (if enabled in sort) - Optional, but good UX
            if (a.verified && !b.verified) return -1;
            if (!a.verified && b.verified) return 1;

            // 2. Highest Rating First (if available)
            const ratingA = (a as any).rating || 0;
            const ratingB = (b as any).rating || 0;
            if (ratingA !== ratingB) return ratingB - ratingA;

            // 3. Nearest First (if location available)
            if (userLocation.latitude && userLocation.longitude) {
                const distA = calculateDistance(userLocation.latitude, userLocation.longitude, a.lat, a.lng);
                const distB = calculateDistance(userLocation.latitude, userLocation.longitude, b.lat, b.lng);
                return distA - distB;
            }

            // 4. Alphabetical Fallback
            return a.name.localeCompare(b.name);
        });

        return result;
        return result;
    }, [providers, filters, userLocation]);

    return (
        <main className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background overflow-hidden relative">
            {/* Sidebar / Bottom Sheet */}
            <div className={`
                w-full lg:w-96 bg-background/80 backdrop-blur-md border-r border-border 
                flex flex-col overflow-hidden
                lg:relative absolute bottom-0 left-0 right-0 z-10
                h-1/2 lg:h-full shadow-xl lg:shadow-none
            `}>
                {/* Header */}
                <div className="relative z-20 flex-shrink-0 border-b border-border bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between p-4 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-foreground leading-none">{t('title')}</h1>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {filteredProviders.length} resultados
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <FilterBar filters={filters} onFilterChange={setFilters} />
                </div>

                {/* Provider List */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3">
                        {filteredProviders.map((provider) => (
                            <ProviderCard
                                key={provider.id}
                                provider={provider}
                                userLocation={userLocation}
                                onClick={() => setSelectedProvider(provider)}
                                isSelected={selectedProvider?.id === provider.id}
                            />
                        ))}
                        {filteredProviders.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>{t('noResults')}</p>
                                <p className="text-sm">{t('tryAdjusting')}</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <MapboxMap
                    providers={filteredProviders}
                    selectedProvider={selectedProvider}
                    onSelectProvider={setSelectedProvider}
                    userLocation={userLocation}
                    mapboxToken={mapboxToken}
                    distance={filters.distance}
                />
            </div>

            {/* Provider Detail Modal */}
            <AnimatePresence>
                {selectedProvider && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedProvider(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl"
                        >
                            <ProviderDetail
                                provider={selectedProvider}
                                userLocation={userLocation}
                                onClose={() => setSelectedProvider(null)}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main >
    );
}
