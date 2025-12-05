import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
