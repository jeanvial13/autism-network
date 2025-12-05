import { prisma } from '@/lib/prisma';
import MapClient from '@/components/map/MapClient';

export default async function MapPage() {
    // Fetch professional profiles from database (these are the providers)
    let professionals: any[] = [];

    try {
        if (prisma) {
            professionals = await prisma.professionalProfile.findMany({
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
            });
        }
    } catch (error) {
        console.error('Failed to fetch professionals:', error);
        // Return empty array if database is not ready
    }

    // Transform database professionals to match expected format
    const formattedProviders = professionals.map(p => ({
        id: p.id,
        name: p.user.name || 'Professional',
        city: p.city || 'Ubicación Desconocida',
        lat: p.locationLat || 0,
        lng: p.locationLng || 0,
        services: p.specialties,
        verified: p.verificationStatus === 'VERIFIED',
        image: p.user.image || '/placeholder-center.jpg',
        email: p.contactEmail || p.user.email,
        rating: p.rating,
        experienceYears: p.experienceYears,
        patientCount: p.patientCount,
        phoneNumber: p.phoneNumber,
        bio: p.bio
    })).filter(p => p.lat !== 0 && p.lng !== 0); // Only include providers with location

    return <MapClient providers={formattedProviders} />;
}
