import { prisma } from '@/lib/prisma';
import MapClient from '@/components/map/MapClient';

export default async function MapPage() {
    // Fetch providers from database
    const providers = await prisma?.provider.findMany({
        where: {
            isActive: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    }) || [];

    // Transform database providers to match expected format
    const formattedProviders = providers.map(p => ({
        id: p.id,
        name: p.name,
        city: p.city || '',
        lat: p.latitude,
        lng: p.longitude,
        services: p.services,
        verified: p.isVerified,
        image: '/placeholder-center.jpg'
    }));

    return <MapClient providers={formattedProviders} />;
}
