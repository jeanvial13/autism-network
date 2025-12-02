import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting production seed...');

    // 1. Seed Providers (ProfessionalProfiles)
    console.log('Creating providers...');

    const providers = [
        { name: "Dr. Sarah Chen", email: "sarah.chen.prod@example.com", lat: 40.7128, lng: -74.0060, city: "New York", specialty: "ABA Therapy" },
        { name: "Dr. Michael Thompson", email: "michael.t.prod@example.com", lat: 51.5074, lng: -0.1278, city: "London", specialty: "Speech Therapy" },
        { name: "Dr. Maria Rodriguez", email: "maria.r.prod@example.com", lat: 40.4168, lng: -3.7038, city: "Madrid", specialty: "Occupational Therapy" },
        { name: "Dr. James Wilson", email: "james.w.prod@example.com", lat: 43.6532, lng: -79.3832, city: "Toronto", specialty: "Diagnostic Assessment" },
        { name: "Dr. Emma Brown", email: "emma.b.prod@example.com", lat: -33.8688, lng: 151.2093, city: "Sydney", specialty: "ABA Therapy" },
        { name: "Dr. Li Wei", email: "li.wei.prod@example.com", lat: 1.3521, lng: 103.8198, city: "Singapore", specialty: "Behavioral Support" },
        { name: "Dr. Anna Kowalski", email: "anna.k.prod@example.com", lat: 52.5200, lng: 13.4050, city: "Berlin", specialty: "Speech Therapy" },
        { name: "Dr. Carlos Santos", email: "carlos.s.prod@example.com", lat: -23.5505, lng: -46.6333, city: "São Paulo", specialty: "Occupational Therapy" },
        { name: "Dr. Yuki Tanaka", email: "yuki.t.prod@example.com", lat: 35.6762, lng: 139.6503, city: "Tokyo", specialty: "Diagnostic Assessment" },
        { name: "Dr. Sofia Andersson", email: "sofia.a.prod@example.com", lat: 59.3293, lng: 18.0686, city: "Stockholm", specialty: "Social Skills Training" },
        { name: "Centro Autismo Mexico", email: "contacto@autismomexico.org", lat: 19.4326, lng: -99.1332, city: "Mexico City", specialty: "Comprehensive Care" },
        { name: "Monterrey Autism Center", email: "info@autismomty.com", lat: 25.6866, lng: -100.3161, city: "Monterrey", specialty: "Early Intervention" }
    ];

    for (const p of providers) {
        // Create User first
        const user = await prisma.user.upsert({
            where: { email: p.email },
            update: {},
            create: {
                name: p.name,
                email: p.email,
                role: 'PROFESSIONAL',
            }
        });

        // Create Profile
        await prisma.professionalProfile.upsert({
            where: { userId: user.id },
            update: {
                locationLat: p.lat,
                locationLng: p.lng,
                verificationStatus: 'VERIFIED',
                specialties: [p.specialty, 'Autism Support']
            },
            create: {
                userId: user.id,
                licenseNumber: `LIC-${Math.floor(Math.random() * 10000)}`,
                licenseCountry: 'Global',
                verificationStatus: 'VERIFIED',
                specialties: [p.specialty, 'Autism Support'],
                bio: `Experienced professional specializing in ${p.specialty}. Dedicated to providing evidence-based support for autistic individuals and their families.`,
                locationLat: p.lat,
                locationLng: p.lng
            }
        });
    }
    console.log(`✅ Seeded ${providers.length} providers`);

    // 2. Seed Resources
    console.log('Creating resources...');
    const resources = [
        {
            title: "Visual Schedule Kit",
            description: "Complete visual schedule pack with 50+ icons for daily routines.",
            url: "https://www.autismspeaks.org/sites/default/files/2018-08/Visual%20Supports%20Tool%20Kit.pdf",
            fileType: "PDF",
            topics: ["daily_living", "visual_supports"],
            targetAge: ["early_childhood", "elementary"]
        },
        {
            title: "Social Story: Going to the Dentist",
            description: "Step-by-step social story to help prepare for dental visits.",
            url: "https://www.autism.org.uk/advice-and-guidance/topics/communication/communication-tools/social-stories-and-comic-strip-conversations",
            fileType: "guide",
            topics: ["social_skills", "health"],
            targetAge: ["kids", "teens"]
        },
        {
            title: "Sensory Regulation Strategies",
            description: "Guide for parents on managing sensory processing differences.",
            url: "https://childmind.org/article/sensory-processing-issues-explained/",
            fileType: "webpage",
            topics: ["sensory", "parenting"],
            targetAge: ["all"]
        },
        {
            title: "IEP Checklist for Parents",
            description: "Comprehensive checklist to prepare for Individualized Education Program meetings.",
            url: "https://www.parentcenterhub.org/iep-checklist/",
            fileType: "PDF",
            topics: ["education", "advocacy"],
            targetAge: ["school_age"]
        },
        {
            title: "Communication Board - Basic Needs",
            description: "Printable communication board for non-speaking individuals.",
            url: "https://www.assistiveware.com/learn-aac/road-to-communication",
            fileType: "image",
            topics: ["communication", "aac"],
            targetAge: ["all"]
        },
        {
            title: "Emotional Regulation Cards",
            description: "Cards to help identify and express emotions.",
            url: "https://zonesofregulation.com/index.php/free-resources/",
            fileType: "PDF",
            topics: ["emotional_regulation", "behavior"],
            targetAge: ["kids", "teens"]
        },
        {
            title: "Autism Safety Kit",
            description: "Safety resources and wandering prevention strategies.",
            url: "https://www.autismspeaks.org/safety",
            fileType: "webpage",
            topics: ["safety", "family"],
            targetAge: ["all"]
        },
        {
            title: "Teen Social Skills Guide",
            description: "Navigating friendships and social situations for teens.",
            url: "https://www.peers.ucla.edu/",
            fileType: "webpage",
            topics: ["social_skills", "teens"],
            targetAge: ["teens"]
        },
        {
            title: "Employment Guide for Autistic Adults",
            description: "Tips for job seeking and workplace accommodations.",
            url: "https://researchautism.org/resources/employment-guide/",
            fileType: "PDF",
            topics: ["employment", "adults"],
            targetAge: ["adults"]
        },
        {
            title: "Sleep Strategies for Autistic Children",
            description: "Evidence-based strategies to improve sleep patterns.",
            url: "https://www.autismspeaks.org/tool-kit/atn-air-p-strategies-improve-sleep-children-autism",
            fileType: "PDF",
            topics: ["health", "daily_living"],
            targetAge: ["kids"]
        }
    ];

    for (const r of resources) {
        await prisma.educationalResource.create({
            data: {
                title: r.title,
                description: r.description,
                url: r.url,
                fileType: r.fileType,
                isDownloadable: r.fileType === 'PDF' || r.fileType === 'image',
                topics: r.topics,
                targetAge: r.targetAge,
                audience: ['parents', 'caregivers'],
                format: ['guide'],
                sourceName: 'Autism Network',
                sourceUrl: 'https://autism-network.org',
                suggestedUses: ['Home', 'School'],
                status: 'ACTIVE'
            }
        });
    }
    console.log(`✅ Seeded ${resources.length} resources`);

    console.log('🏁 Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
