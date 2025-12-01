'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterBar from '@/components/map/FilterBar';
import ProviderCard from '@/components/map/ProviderCard';
import ProviderDetail from '@/components/map/ProviderDetail';
import MapboxMap from '@/components/map/MapboxMap';
import { useGeolocation, calculateDistance } from '@/lib/geolocation';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [filters, setFilters] = useState({
        services: [] as string[],
        verifiedOnly: false,
        distance: 50 // Default 50km
    });

    const userLocation = useGeolocation();
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    // Filter and Sort Providers
    const filteredProviders = useMemo(() => {
        let result = providers.filter(center => {
            // Search Query
            const matchesSearch =
                center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                center.city.toLowerCase().includes(searchQuery.toLowerCase());

            // Service Filter
            const matchesServices = filters.services.length === 0 ||
                filters.services.some(s => center.services.includes(s));

            // Verified Filter
            const matchesVerified = !filters.verifiedOnly || center.verified;

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

            return matchesSearch && matchesServices && matchesVerified && matchesDistance;
        });

        // Sort by distance if user location available
        if (userLocation.latitude && userLocation.longitude) {
            result.sort((a, b) => {
                const distA = calculateDistance(userLocation.latitude!, userLocation.longitude!, a.lat, a.lng);
                const distB = calculateDistance(userLocation.latitude!, userLocation.longitude!, b.lat, b.lng);
                return distA - distB;
            });
        }

        return result;
    }, [providers, searchQuery, filters, userLocation]);

    return (
        <main className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background overflow-hidden relative">
            {/* Sidebar / Bottom Sheet */}
            <div className={`
                w-full lg:w-96 bg-background border-r border-border 
                flex flex-col overflow-hidden
                lg:relative absolute bottom-0 left-0 right-0 z-10
                h-1/2 lg:h-full
            `}>
                {/* Header */}
                <div className="p-6 border-b border-border bg-background">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">Global Map</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        {filteredProviders.length} result{filteredProviders.length !== 1 ? 's' : ''}
                    </p>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search providers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-full"
                        />
                    </div>

                    {/* Filters */}
                    <FilterBar filters={filters} setFilters={setFilters} />
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
                                <p>No providers found</p>
                                <p className="text-sm">Try adjusting your filters</p>
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
                    onProviderSelect={setSelectedProvider}
                    userLocation={userLocation}
                    mapboxToken={mapboxToken}
                />
            </div>

            {/* Provider Detail Modal */}
            <AnimatePresence>
                {selectedProvider && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
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
        </main>
    );
}
