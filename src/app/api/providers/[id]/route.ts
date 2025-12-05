import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const data = await request.json();

        // Update Profile
        const profile = await prisma.professionalProfile.update({
            where: { id },
            data: {
                city: data.city,
                // Update specific location details if provided
                locationLat: data.lat ? parseFloat(data.lat) : undefined,
                locationLng: data.lng ? parseFloat(data.lng) : undefined,
                specialties: data.services,
                verificationStatus: data.verified ? 'VERIFIED' : 'PENDING',
                rating: parseFloat(data.rating || '0'),
                experienceYears: parseInt(data.experienceYears || '0'),
                patientCount: parseInt(data.patientCount || '0'),
                phoneNumber: data.phoneNumber,
                contactEmail: data.email,
                bio: `Especialista en ${data.services?.[0] || 'Autismo'} en ${data.city}.`
            },
            include: { user: true }
        });

        // Update User info (Name/Email) if needed
        if (data.name && profile.userId) {
            await prisma.user.update({
                where: { id: profile.userId },
                data: {
                    name: data.name,
                    email: data.email
                }
            });
        }

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error('Error updating provider:', error);
        return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id; // Profile ID

        // Find profile to get userId
        const profile = await prisma.professionalProfile.findUnique({
            where: { id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        // Delete User (cascades to profile)
        await prisma.user.delete({
            where: { id: profile.userId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting provider:', error);
        return NextResponse.json({ error: 'Failed to delete provider' }, { status: 500 });
    }
}
