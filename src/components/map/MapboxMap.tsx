'use client';

import { useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ProviderPopup from './ProviderPopup';
import { calculateDistance, formatDistance } from '@/lib/geolocation';

interface MapboxMapProps {
    providers: any[];
    userLocation: { latitude: number | null; longitude: number | null };
    selectedProvider: any;
    onSelectProvider: (provider: any) => void;
    mapboxToken: string;
}

export default function MapboxMap({
    providers,
    userLocation,
    selectedProvider,
    onSelectProvider,
    mapboxToken
}: MapboxMapProps) {
    const mapRef = useRef<any>(null);

    // Fly to selected provider
    useEffect(() => {
        if (selectedProvider && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedProvider.lng, selectedProvider.lat],
                zoom: 14,
                duration: 2000
            });
        }
    }, [selectedProvider]);

    // Fly to user location on load if available
    useEffect(() => {
        if (userLocation.latitude && userLocation.longitude && mapRef.current && !selectedProvider) {
            mapRef.current.flyTo({
                center: [userLocation.longitude, userLocation.latitude],
                zoom: 12,
                duration: 2000
            });
        }
    }, [userLocation, selectedProvider]);

    return (
        <Map
            ref={mapRef}
            initialViewState={{
                longitude: -98.5795,
                latitude: 39.8283,
                zoom: 3.5
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={mapboxToken}
        >
            <NavigationControl position="bottom-right" />
            <GeolocateControl position="bottom-right" />

            {/* User Location Marker */}
            {userLocation.latitude && userLocation.longitude && (
                <Marker
                    longitude={userLocation.longitude}
                    latitude={userLocation.latitude}
                    anchor="center"
                >
                    <div className="relative flex items-center justify-center w-6 h-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-lg"></span>
                    </div>
                </Marker>
            )}

            {/* Provider Markers */}
            {providers.map((provider) => (
                <Marker
                    key={provider.id}
                    longitude={provider.lng}
                    latitude={provider.lat}
                    anchor="bottom"
                    onClick={(e: any) => {
                        e.originalEvent.stopPropagation();
                        onSelectProvider(provider);
                    }}
                >
                    <div className={`group cursor-pointer transition-transform hover:scale-110 ${selectedProvider?.id === provider.id ? 'scale-125 z-10' : ''}`}>
                        <MapPin
                            className={`h-8 w-8 drop-shadow-md ${selectedProvider?.id === provider.id
                                ? 'text-primary fill-primary/20'
                                : 'text-primary/80 fill-background'
                                }`}
                        />
                    </div>
                </Marker>
            ))}

            {/* Popup */}
            {selectedProvider && (
                <Popup
                    longitude={selectedProvider.lng}
                    latitude={selectedProvider.lat}
                    anchor="top"
                    onClose={() => onSelectProvider(null)}
                    closeButton={false}
                    className="z-20"
                    offset={10}
                >
                    <ProviderPopup
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
                        onClose={() => { }} // Detail view handles full details
                    />
                </Popup>
            )}
        </Map>
    );
}
