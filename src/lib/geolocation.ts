import { useState, useEffect } from 'react';

// Haversine formula to calculate distance between two points in km
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m away`;
    }
    return `${distanceKm.toFixed(1)} km away`;
}

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
    source: 'gps' | 'ip' | 'default' | null;
}

const DEFAULT_LOCATION = {
    latitude: 19.4326, // Mexico City
    longitude: -99.1332
};

export function useRobustGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
        source: null
    });

    useEffect(() => {
        let mounted = true;

        const setLocation = (lat: number, lng: number, src: 'gps' | 'ip' | 'default', err: string | null = null) => {
            if (!mounted) return;

            // Persist to localStorage
            try {
                localStorage.setItem('last_known_location', JSON.stringify({ latitude: lat, longitude: lng }));
            } catch (e) {
                // Ignore storage errors
            }

            setState({
                latitude: lat,
                longitude: lng,
                error: err,
                loading: false,
                source: src
            });
        };

        const tryIpGeolocation = async () => {
            try {
                console.log('📍 Attempting IP geolocation...');
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('IP Geolocation failed');

                const data = await response.json();
                if (data.latitude && data.longitude) {
                    console.log('✅ IP Geolocation successful');
                    setLocation(data.latitude, data.longitude, 'ip');
                    return true;
                }
            } catch (error) {
                console.warn('⚠️ IP Geolocation failed:', error);
            }
            return false;
        };

        const useFallbackLocation = () => {
            // Try localStorage first
            try {
                const saved = localStorage.getItem('last_known_location');
                if (saved) {
                    const { latitude, longitude } = JSON.parse(saved);
                    console.log('📂 Using saved last known location');
                    setLocation(latitude, longitude, 'default');
                    return;
                }
            } catch (e) {
                // Ignore
            }

            // Default to Mexico City
            console.log('🇲🇽 Using default location (Mexico City)');
            setLocation(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, 'default');
        };

        // Layer 1: Browser GPS
        if (!navigator.geolocation) {
            // Layer 2: IP Geolocation
            tryIpGeolocation().then(success => {
                if (!success) useFallbackLocation(); // Layer 3: Default
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('✅ GPS Geolocation successful');
                setLocation(position.coords.latitude, position.coords.longitude, 'gps');
            },
            async (error) => {
                console.warn('⚠️ GPS failed, trying fallback:', error.message);
                // Layer 2: IP Geolocation
                const ipSuccess = await tryIpGeolocation();
                if (!ipSuccess) {
                    // Layer 3: Default
                    useFallbackLocation();
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        return () => {
            mounted = false;
        };
    }, []);

    return state;
}

// Keep legacy export for compatibility if needed, but alias it
export const useGeolocation = useRobustGeolocation;
