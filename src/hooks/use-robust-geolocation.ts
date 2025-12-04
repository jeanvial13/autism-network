import { useState, useEffect, useCallback } from 'react';

export interface LocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
    source: 'gps' | 'ip' | 'default' | null;
}

const DEFAULT_LOCATION = {
    latitude: 19.4326, // Mexico City
    longitude: -99.1332,
    source: 'default' as const
};

export function useRobustGeolocation() {
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
        source: null
    });

    const setLocationState = useCallback((lat: number, lng: number, source: 'gps' | 'ip' | 'default') => {
        setLocation({
            latitude: lat,
            longitude: lng,
            error: null,
            loading: false,
            source
        });
        // Cache successful location
        if (typeof window !== 'undefined') {
            localStorage.setItem('last_known_loc', JSON.stringify({ lat, lng, source }));
        }
    }, []);

    const fetchIpLocation = useCallback(async () => {
        try {
            console.log('🌐 Attempting IP-based geolocation...');
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) throw new Error('IP API failed');

            const data = await response.json();
            if (data.latitude && data.longitude) {
                console.log('✅ IP geolocation successful');
                setLocationState(data.latitude, data.longitude, 'ip');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ IP geolocation failed:', error);
        }
        return false;
    }, [setLocationState]);

    const useDefaultLocation = useCallback(() => {
        console.log('📍 Using default location (Mexico City)');
        // Try to recover from local storage first
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('last_known_loc');
            if (saved) {
                try {
                    const { lat, lng, source } = JSON.parse(saved);
                    setLocationState(lat, lng, source || 'default');
                    return;
                } catch (e) {
                    // ignore parse error
                }
            }
        }
        setLocationState(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, 'default');
    }, [setLocationState]);

    useEffect(() => {
        if (!navigator.geolocation) {
            fetchIpLocation().then(success => !success && useDefaultLocation());
            return;
        }

        console.log('🛰️ Requesting GPS location...');

        const successHandler = (position: GeolocationPosition) => {
            console.log('✅ GPS location successful');
            setLocationState(position.coords.latitude, position.coords.longitude, 'gps');
        };

        const errorHandler = async (error: GeolocationPositionError) => {
            console.warn(`⚠️ GPS Error (${error.code}): ${error.message}`);
            // Fallback to IP
            const ipSuccess = await fetchIpLocation();
            if (!ipSuccess) {
                useDefaultLocation();
            }
        };

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);

    }, [fetchIpLocation, useDefaultLocation, setLocationState]);

    return location;
}
