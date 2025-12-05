import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List all providers
export async function GET() {
    try {
        const providers = await prisma.professionalProfile.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform for frontend
        const formatted = providers.map(p => ({
            id: p.id,
            name: p.user.name,
            email: p.contactEmail || p.user.email,
            image: p.user.image,
            city: p.city,
            lat: p.locationLat,
            lng: p.locationLng,
            specialties: p.specialties,
            rating: p.rating,
            experienceYears: p.experienceYears,
            patientCount: p.patientCount,
            phoneNumber: p.phoneNumber,
            verified: p.verificationStatus === 'VERIFIED',
            bio: p.bio
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Error fetching providers:', error);
        return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
    }
}

// POST: Create a new provider
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, city, lat, lng, services, verified, rating, experienceYears, patientCount, phoneNumber } = body;

        // Create User first (required for profile)
        // Note: In a real app we might want to check if user exists or handle auth differently
        // For this admin tool, we'll create a user linked to this provider

        // Check if email exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    role: 'PROFESSIONAL',
                    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
                }
            });
        }

        // Create Profile
        const profile = await prisma.professionalProfile.create({
            data: {
                userId: user.id,
                city,
                locationLat: parseFloat(lat),
                locationLng: parseFloat(lng),
                specialties: services,
                verificationStatus: verified ? 'VERIFIED' : 'PENDING',
                rating: parseFloat(rating || '0'),
                experienceYears: parseInt(experienceYears || '0'),
                patientCount: parseInt(patientCount || '0'),
                phoneNumber,
                contactEmail: email,
                licenseNumber: 'PENDING',
                licenseCountry: 'MX', // Default
                bio: `Especialista en ${services[0] || 'Autismo'} en ${city}.`
            }
        });

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error creating provider:', error);
        return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
    }
}
