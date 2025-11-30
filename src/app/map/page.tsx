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
import { useGeolocation, calculateDistance, formatDistance } from '@/lib/geolocation';

// Example autism centers (mock data)
const EXAMPLE_CENTERS = [
    { id: 1, name: 'NYC Autism Center', city: 'New York, NY', lat: 40.7128, lng: -74.006, services: ['Diagnosis', 'Therapy'], verified: true, image: '/placeholder-center.jpg' },
    { id: 2, name: 'LA Therapy Services', city: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, services: ['ABA Therapy', 'Speech Therapy'], verified: true, image: '/placeholder-center.jpg' },
    { id: 3, name: 'Chicago Support Network', city: 'Chicago, IL', lat: 41.8781, lng: -87.6298, services: ['Support Groups', 'Education'], verified: false, image: '/placeholder-center.jpg' },
    { id: 4, name: 'Houston Autism Institute', city: 'Houston, TX', lat: 29.7604, lng: -95.3698, services: ['Diagnosis', 'Research'], verified: true, image: '/placeholder-center.jpg' },
    { id: 5, name: 'Phoenix Family Center', city: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, services: ['Family Support', 'Therapy'], verified: true, image: '/placeholder-center.jpg' },
    {
        id: 1764523423537,
        name: 'Mari Rodriguez',
        city: 'Apizaco',
        lat: 19.410992226111134,
        lng: -98.15360954686092,
        services: ['Diagnosis', 'Occupational Therapy', 'Family Support', 'Research', 'Support Groups', 'ABA Therapy', 'Speech Therapy', 'Education', 'Early Intervention'],
        verified: true,
        image: '/placeholder-center.jpg'
    },
    {
        id: 1764523519507,
        name: 'Pamela Pichardo',
        city: 'Apizaco',
        lat: 19.41589332491111,
        lng: -98.15119658806802,
        services: ['Diagnosis', 'Occupational Therapy', 'Family Support', 'Research', 'Support Groups', 'ABA Therapy', 'Speech Therapy', 'Education', 'Early Intervention'],
        verified: true,
        image: '/placeholder-center.jpg'
    },
];

export default function MapPage() {
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
        let result = EXAMPLE_CENTERS.filter(center => {
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
    }, [searchQuery, filters, userLocation]);

    return (
        <main className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background overflow-hidden relative">
            {/* Sidebar / Bottom Sheet */}
            <div className={`
                flex flex-col bg-background/95 backdrop-blur border-r border-border z-20 transition-all duration-300
                lg:w-96 lg:h-full lg:relative
                absolute bottom-0 w-full h-[40vh] rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] lg:shadow-none lg:rounded-none
                ${selectedProvider ? 'translate-y-full lg:translate-y-0' : 'translate-y-0'}
            `}>
                {/* Header & Search */}
                <div className="p-4 border-b border-border space-y-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold text-foreground">Global Map</h1>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {filteredProviders.length} results
                        </span>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search providers..."
                            className="pl-10 rounded-full bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <FilterBar filters={filters} onFilterChange={setFilters} />

                {/* Provider List */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-3 pb-20 lg:pb-4">
                        <AnimatePresence mode='popLayout'>
                            {filteredProviders.map((provider) => (
                                <ProviderCard
                                    key={provider.id}
                                    provider={provider}
                                    distance={
                                        userLocation.latitude && userLocation.longitude
                                            ? formatDistance(calculateDistance(
                                                userLocation.latitude,
                                                userLocation.longitude,
                                                provider.lat,
                                                provider.lng
                                            ))
                                            : undefined
                                    }
                                    isSelected={selectedProvider?.id === provider.id}
                                    onClick={() => setSelectedProvider(provider)}
                                />
                            ))}
                        </AnimatePresence>

                        {filteredProviders.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No providers found matching your criteria.</p>
                                <button
                                    onClick={() => setFilters({ services: [], verifiedOnly: false, distance: 100 })}
                                    className="text-primary hover:underline mt-2 text-sm"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative h-full w-full">
                <MapboxMap
                    providers={filteredProviders}
                    userLocation={userLocation}
                    selectedProvider={selectedProvider}
                    onSelectProvider={setSelectedProvider}
                    mapboxToken={mapboxToken}
                />
            </div>

            {/* Provider Detail View */}
            <AnimatePresence>
                {selectedProvider && (
                    <ProviderDetail
                        provider={selectedProvider}
                        distance={
                            userLocation.latitude && userLocation.longitude
                                ? formatDistance(calculateDistance(
                                    userLocation.latitude,
                                    userLocation.longitude,
                                    selectedProvider.lat,
                                    selectedProvider.lng
                                ))
                                : undefined
                        }
                        onClose={() => setSelectedProvider(null)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
