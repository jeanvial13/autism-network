'use client';

import { useRef, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, Source, Layer, MapRef } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ProviderPopup from './ProviderPopup';
import { calculateDistance, formatDistance } from '@/lib/geolocation';
import mapboxgl from 'mapbox-gl';

interface MapboxMapProps {
    providers: any[];
    userLocation: { latitude: number | null; longitude: number | null };
    selectedProvider: any;
    onSelectProvider: (provider: any) => void;
    mapboxToken: string;
    distance: number;
}

// Helper to create a GeoJSON circle
const createGeoJSONCircle = (center: [number, number], radiusInKm: number, points = 64) => {
    const coords = {
        latitude: center[1],
        longitude: center[0]
    };

    const km = radiusInKm;

    const ret = [];
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [ret]
        },
        properties: {}
    };
};

export default function MapboxMap({
    providers,
    userLocation,
    selectedProvider,
    onSelectProvider,
    mapboxToken,
    distance
}: MapboxMapProps) {
    const mapRef = useRef<MapRef>(null);

    // Convert providers to GeoJSON for clustering
    const providersGeoJSON = useMemo(() => ({
        type: 'FeatureCollection',
        features: providers.map(p => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
            properties: { ...p, id: p.id } // Ensure ID is passed
        }))
    }), [providers]);

    // Create radius circle GeoJSON
    const radiusGeoJSON = useMemo(() => {
        if (!userLocation.latitude || !userLocation.longitude || distance > 10000) return null;
        return createGeoJSONCircle([userLocation.longitude, userLocation.latitude], distance);
    }, [userLocation, distance]);

    // Auto-Zoom to fit providers (Smart Bounds)
    useEffect(() => {
        if (providers.length > 0 && mapRef.current) {
            const bounds = new mapboxgl.LngLatBounds();

            // Include user location in bounds if available and REASONABLE (local search)
            // If global search, fitting to user location + providers might zoom out way too much if providers are far.
            // But usually we want to see where we are relative to providers.
            // Let's keep it but maybe optimize later. Use user location only if within reasonable distance?
            // For now, standard fitBounds is fine.
            if (userLocation.longitude && userLocation.latitude && distance < 10000) {
                bounds.extend([userLocation.longitude, userLocation.latitude]);
            }

            providers.forEach(p => {
                bounds.extend([p.lng, p.lat]);
            });

            // "Genius" fit: Add generous padding and smooth animation
            mapRef.current.fitBounds(bounds, {
                padding: { top: 100, bottom: 100, left: 100, right: 350 }, // Extra right padding for sidebar
                maxZoom: 14,
                duration: 2500, // Slower, more cinematic
                essential: true
            });
        }
    }, [providers, userLocation, distance]);

    // ... (rest of file)

    return (
        <Map
            ref={mapRef}
            initialViewState={{
                longitude: -98.5795,
                latitude: 39.8283,
                zoom: 3.5
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/light-v11" // Lighter, more premium style
            mapboxAccessToken={mapboxToken}
            interactiveLayerIds={['clusters', 'unclustered-point']}
            onClick={onClick}
        >
            <NavigationControl position="bottom-right" />
            <GeolocateControl position="bottom-right" />

            {/* Radius Circle Layer */}
            {radiusGeoJSON && (
                <Source id="radius" type="geojson" data={radiusGeoJSON as any}>
                    <Layer
                        id="radius-fill"
                        type="fill"
                        paint={{
                            'fill-color': '#4f46e5', // Indigo-600
                            'fill-opacity': 0.1
                        }}
                    />
                    <Layer
                        id="radius-line"
                        type="line"
                        paint={{
                            'line-color': '#4f46e5',
                            'line-width': 2,
                            'line-dasharray': [2, 2]
                        }}
                    />
                </Source>
            )}

            {/* Providers Clustering Source */}
            <Source
                id="providers"
                type="geojson"
                data={providersGeoJSON as any}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
            >
                {/* Clusters Layer */}
                <Layer
                    id="clusters"
                    type="circle"
                    filter={['has', 'point_count']}
                    paint={{
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#818cf8', // Indigo-400
                            10,
                            '#6366f1', // Indigo-500
                            30,
                            '#4f46e5'  // Indigo-600
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            10,
                            30,
                            30,
                            40
                        ]
                    }}
                />

                {/* Cluster Count Text */}
                <Layer
                    id="cluster-count"
                    type="symbol"
                    filter={['has', 'point_count']}
                    layout={{
                        'text-field': '{point_count_abbreviated}',
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }}
                />

                {/* Unclustered Points (Individual Providers) */}
                <Layer
                    id="unclustered-point"
                    type="circle"
                    filter={['!', ['has', 'point_count']]}
                    paint={{
                        'circle-color': '#11b4da',
                        'circle-radius': 8,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#fff'
                    }}
                />
            </Source>

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

            {/* Popup for Selected Provider */}
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
                        onClose={() => { }}
                    />
                </Popup>
            )}
        </Map>
    );
}
