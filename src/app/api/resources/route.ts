import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const resources = await prisma.educationalResource.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
    }
}
