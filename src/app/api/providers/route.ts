import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const professionals = await prisma.professionalProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        });

        // Transform to match the expected "Provider" format
        const providers = professionals.map(p => ({
            id: p.id,
            name: p.user.name || 'Professional',
            email: p.user.email,
            lat: p.locationLat,
            lng: p.locationLng,
            verified: p.verificationStatus === 'VERIFIED',
            specialties: p.specialties,
            licenseNumber: p.licenseNumber,
            bio: p.bio
        }));

        return NextResponse.json(providers);
    } catch (error) {
        console.error('Error fetching providers:', error);
        return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
    }
}
