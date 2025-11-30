'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Example autism centers (mock data)
const EXAMPLE_CENTERS = [
    { id: 1, name: 'NYC Autism Center', lat: 40.7128, lng: -74.006 },
    { id: 2, name: 'LA Therapy Services', lat: 34.0522, lng: -118.2437 },
    { id: 3, name: 'Chicago Support Network', lat: 41.8781, lng: -87.6298 },
];

export default function GlobalMap() {
    return (
        <div className="w-full h-[calc(100vh-4rem)] rounded-lg overflow-hidden border border-border">
            <MapContainer
                center={[40, -100]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {EXAMPLE_CENTERS.map((center) => (
                    <Marker key={center.id} position={[center.lat, center.lng]}>
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-semibold text-primary">{center.name}</h3>
                                <p className="text-sm text-muted-foreground">Click for details</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
