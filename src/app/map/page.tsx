import { prisma } from '@/lib/prisma';
import MapClient from '@/components/map/MapClient';

export default async function MapPage() {
    // Fetch professional profiles from database (these are the providers)
    const professionals = await prisma?.professionalProfile.findMany({
        where: {
            verificationStatus: 'VERIFIED'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    }) || [];

    // Transform database professionals to match expected format
    const formattedProviders = professionals.map(p => ({
        id: p.id,
        name: p.user.name || 'Professional',
        city: '', // We don't have city in the schema, will need to derive from lat/lng or add it
        lat: p.locationLat || 0,
        lng: p.locationLng || 0,
        services: p.specialties,
        verified: p.verificationStatus === 'VERIFIED',
        image: '/placeholder-center.jpg'
    })).filter(p => p.lat !== 0 && p.lng !== 0); // Only include providers with location

    return <MapClient providers={formattedProviders} />;
}
