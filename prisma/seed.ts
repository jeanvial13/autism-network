import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data - EXCEPT users to preserve admin
    console.log('🧹 Clearing existing data (preserving users)...');
    await prisma.articleTranslation.deleteMany();
    // await prisma.article.deleteMany(); // Don't delete articles to test idempotency
    // await prisma.educationalResource.deleteMany(); // Don't delete resources to test idempotency
    // await prisma.professionalProfile.deleteMany(); // Don't delete profiles to test idempotency
    // await prisma.user.deleteMany(); // DO NOT DELETE USERS

    // ========================================
    // 0. CREATE ADMIN USER
    // ========================================
    const adminUser = process.env.ADMIN_USER?.trim();
    const adminPass = process.env.ADMIN_PASS?.trim();
    const adminName = process.env.ADMIN_NAME?.trim();

    if (adminUser && adminPass) {
        const existingAdmin = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: adminUser },
                    { username: adminUser }
                ]
            }
        });

        if (!existingAdmin) {
            console.log('🛡️ Creating admin user...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(adminPass, 10);

            await prisma.user.create({
                data: {
                    email: adminUser.includes('@') ? adminUser : `admin-${Date.now()}@example.com`,
                    username: adminUser,
                    name: adminName || 'Admin',
                    passwordHash: hashedPassword,
                    role: 'ADMIN',
                }
            });
            console.log('✅ Admin user created successfully');
        } else {
            console.log('ℹ️ Admin user already exists. Skipping creation.');
        }
    }

    // ========================================
    // 1. CREATE PROFESSIONAL PROFILES (Map Providers)
    // ========================================
    console.log('👥 Creating professional profiles...');

    const professionals = [
        {
            id: "1764523423537",
            name: "Mari Rodríguez",
            email: "mari.rodriguez@t-conecta.com",
            city: "Apizaco",
            lat: 19.410992226111134,
            lng: 98.15360954686092,
            country: "Mexico",
            verified: true,
            services: [
                "Diagnóstico",
                "Terapia Ocupacional",
                "Apoyo Familiar",
                "Investigación",
                "Grupos de Apoyo",
                "Terapia ABA",
                "Terapia de Lenguaje",
                "Educación",
                "Intervención Temprana"
            ]
        },
        {
            id: "1764523519507",
            name: "Pamela Pichardo",
            email: "pamela.pichardo@t-conecta.com",
            city: "Apizaco",
            lat: 19.41589332491111,
            lng: 98.15119658806802,
            country: "Mexico",
            verified: true,
            services: [
                "Diagnóstico",
                "Terapia Ocupacional",
                "Apoyo Familiar",
                "Investigación",
                "Grupos de Apoyo",
                "Terapia ABA",
                "Terapia de Lenguaje",
                "Educación",
                "Intervención Temprana"
            ]
        },
        // Keep some existing dummy data for variety, but translated
        { name: 'Dr. Sarah Chen', email: 'sarah.chen@example.com', services: ['Terapia ABA'], city: 'New York', lat: 40.7128, lng: -74.0060, country: 'USA' },
        { name: 'Dr. Michael Thompson', email: 'michael.t@example.com', services: ['Terapia de Lenguaje'], city: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
        { name: 'Dr. Maria Rodriguez', email: 'maria.r@example.com', services: ['Terapia Ocupacional'], city: 'Madrid', lat: 40.4168, lng: -3.7038, country: 'Spain' },
    ];

    for (const prof of professionals) {
        // 1. Check if user exists
        let user = await prisma.user.findUnique({
            where: { email: prof.email }
        });

        if (!user) {
            // Create user if not exists
            console.log(`Creating user for ${prof.email}...`);
            user = await prisma.user.create({
                data: {
                    id: prof.id, // Will be undefined for dummy data, which is fine (Prisma generates UUID)
                    name: prof.name,
                    email: prof.email,
                    role: 'PROFESSIONAL',
                },
            });
        } else {
            console.log(`User ${prof.email} already exists. Using existing user.`);
        }

        // 2. Check if profile exists
        const existingProfile = await prisma.professionalProfile.findUnique({
            where: { userId: user.id }
        });

        if (!existingProfile) {
            console.log(`Creating profile for ${prof.email}...`);
            const isVerified = 'verified' in prof ? (prof as { verified: boolean }).verified : false;

            await prisma.professionalProfile.create({
                data: {
                    userId: user.id,
                    bio: `Especialista en ${prof.services[0]} con experiencia en apoyo basado en evidencia.`,
                    specialties: prof.services,
                    licenseNumber: `LIC${Math.floor(Math.random() * 100000)}`,
                    licenseCountry: prof.country,
                    locationLat: prof.lat,
                    locationLng: prof.lng,
                    verificationStatus: isVerified ? 'VERIFIED' : 'VERIFIED',
                },
            });
        } else {
            console.log(`Profile for ${prof.email} already exists. Skipping.`);
        }
    }

    console.log(`✅ Professional profiles processing completed`);

    // ========================================
    // 2. CREATE EDUCATIONAL RESOURCES
    // ========================================
    console.log('📚 Creating educational resources...');

    const resources = [
        {
            title: 'Visual Schedule for Morning Routine',
            description: 'A printable visual schedule with picture cards to help children follow their morning routine independently.',
            suggestedUses: ['Use at home or school to promote independence and reduce anxiety during transitions.'],
            url: 'https://example.com/resources/visual-schedule-morning',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['parents', 'educators'],
            topics: ['daily_living', 'communication'],
            format: ['visual_schedule'],
        },
        {
            title: 'Social Stories: Making Friends at School',
            description: 'A social story template to help autistic children understand and navigate social situations at school.',
            suggestedUses: ['Read together before school or social events to prepare for interactions.'],
            url: 'https://example.com/resources/social-story-friends',
            fileType: 'PDF',
            targetAge: ['elementary', 'teens'],
            audience: ['parents', 'educators'],
            topics: ['social_skills', 'communication'],
            format: ['social_story'],
        },
        {
            title: 'Emotion Cards for Identification',
            description: 'Colorful emotion identification cards featuring diverse faces expressing different feelings.',
            suggestedUses: ['Practice emotion recognition and help children communicate their feelings.'],
            url: 'https://example.com/resources/emotion-cards',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['parents', 'professionals'],
            topics: ['communication', 'social_skills'],
            format: ['worksheet'],
        },
        {
            title: 'Sensory Break Activity Cards',
            description: 'Quick sensory break activities that can be done at home or in the classroom.',
            suggestedUses: ['Use when a child shows signs of sensory overload or needs a break.'],
            url: 'https://example.com/resources/sensory-breaks',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary', 'teens'],
            audience: ['parents', 'educators', 'professionals'],
            topics: ['sensory', 'behavior_support'],
            format: ['guide'],
        },
        {
            title: 'Math Worksheets with Visual Supports',
            description: 'Math practice worksheets designed with visual supports for learners who benefit from concrete examples.',
            suggestedUses: ['Use for homework or classroom practice to build math skills.'],
            url: 'https://example.com/resources/math-visual',
            fileType: 'PDF',
            targetAge: ['elementary'],
            audience: ['educators', 'parents'],
            topics: ['academic'],
            format: ['worksheet'],
        },
        {
            title: 'Communication Board - Basic Needs',
            description: 'A printable communication board with symbols for basic needs and wants.',
            suggestedUses: ['Ideal for non-speaking or minimally speaking individuals to express needs.'],
            url: 'https://example.com/resources/comm-board-basic',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary', 'teens', 'adults'],
            audience: ['parents', 'professionals'],
            topics: ['communication'],
            format: ['visual_schedule'],
        },
        {
            title: 'Calm Down Corner Setup Guide',
            description: 'A comprehensive guide for creating a sensory-friendly calm down space at home or school.',
            suggestedUses: ['Reference when setting up a designated space for self-regulation.'],
            url: 'https://example.com/resources/calm-down-corner',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['parents', 'educators'],
            topics: ['sensory', 'behavior_support'],
            format: ['guide'],
        },
        {
            title: 'Transition Timers - Visual Countdown',
            description: 'Printable visual timers to help with transitions between activities.',
            suggestedUses: ['Display before transitions to prepare children for changes in routine.'],
            url: 'https://example.com/resources/transition-timers',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['parents', 'educators'],
            topics: ['daily_living', 'behavior_support'],
            format: ['visual_schedule'],
        },
        {
            title: 'Job Skills Checklist for Teens',
            description: 'A checklist to teach and track job-related skills for autistic teenagers.',
            suggestedUses: ['Use in transition planning or life skills programs.'],
            url: 'https://example.com/resources/job-skills-teens',
            fileType: 'PDF',
            targetAge: ['teens'],
            audience: ['educators', 'professionals'],
            topics: ['daily_living', 'academic'],
            format: ['worksheet'],
        },
        {
            title: 'Self-Advocacy Scripts',
            description: 'A practice scripts for autistic individuals to advocate for their needs in various settings.',
            suggestedUses: ['Role-play and practice before real-life situations.'],
            url: 'https://example.com/resources/self-advocacy',
            fileType: 'PDF',
            targetAge: ['teens', 'adults'],
            audience: ['parents', 'professionals'],
            topics: ['communication', 'social_skills'],
            format: ['guide'],
        },
        {
            title: 'Fine Motor Skills Practice Sheets',
            description: 'Tracing and cutting activities to develop fine motor skills.',
            suggestedUses: ['Daily practice for children working on handwriting and coordination.'],
            url: 'https://example.com/resources/fine-motor',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['parents', 'professionals'],
            topics: ['academic', 'daily_living'],
            format: ['worksheet'],
        },
        {
            title: 'Birthday Party Social Story',
            description: 'A social story explaining what to expect at a birthday party.',
            suggestedUses: ['Read before attending parties to reduce anxiety and prepare.'],
            url: 'https://example.com/resources/birthday-party-story',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['parents'],
            topics: ['social_skills'],
            format: ['social_story'],
        },
        {
            title: 'Bedtime Routine Visual Schedule',
            description: 'Step-by-step visual guide for a consistent bedtime routine.',
            suggestedUses: ['Display in bedroom to promote independent bedtime preparation.'],
            url: 'https://example.com/resources/bedtime-schedule',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['parents'],
            topics: ['daily_living'],
            format: ['visual_schedule'],
        },
        {
            title: 'Healthy vs Unhealthy Foods Sorting Activity',
            description: 'A fun sorting activity to teach nutrition concepts.',
            suggestedUses: ['Use during meal planning or nutrition education.'],
            url: 'https://example.com/resources/food-sorting',
            fileType: 'PDF',
            targetAge: ['elementary'],
            audience: ['parents', 'educators'],
            topics: ['daily_living', 'academic'],
            format: ['worksheet'],
        },
        {
            title: 'Playground Safety Rules Visual',
            description: 'Visual reminders of playground safety rules and social expectations.',
            suggestedUses: ['Display at playgrounds or review before outdoor play.'],
            url: 'https://example.com/resources/playground-safety',
            fileType: 'PDF',
            targetAge: ['early_childhood', 'elementary'],
            audience: ['educators', 'parents'],
            topics: ['social_skills', 'behavior_support'],
            format: ['guide'],
        },
    ];

    for (const resource of resources) {
        // Check if resource exists by URL
        const existingResource = await prisma.educationalResource.findFirst({
            where: { url: resource.url },
            select: { id: true }
        });

        if (!existingResource) {
            console.log(`Creating resource: ${resource.title}`);
            await prisma.educationalResource.create({
                data: {
                    title: resource.title,
                    description: resource.description,
                    suggestedUses: resource.suggestedUses,
                    url: resource.url,
                    fileType: resource.fileType,
                    isDownloadable: true,
                    requiresAccount: false,
                    targetAge: resource.targetAge,
                    audience: resource.audience,
                    topics: resource.topics,
                    format: resource.format,
                    language: 'en',
                    sourceName: 'Autism Resource Hub',
                    sourceUrl: resource.url,
                    credibilityScore: 85,
                    status: 'ACTIVE',
                }
            });
        } else {
            console.log(`Resource ${resource.title} already exists. Skipping.`);
        }
    }

    console.log(`✅ Educational resources processing completed`);

    // ========================================
    // 3. CREATE ARTICLES
    // ========================================
    console.log('📰 Creating articles...');

    const articles = [
        {
            slug: 'early-intervention-improves-outcomes',
            title: 'Early Intervention Programs Show Significant Benefits for Autistic Toddlers',
            tldr: 'New research confirms that early intervention programs starting before age 3 lead to improved social communication and reduced support needs in autistic children.',
            background: 'Early intervention has long been recommended for autistic children, but the specific outcomes and optimal timing have been debated. This multi-year study tracked 500 autistic toddlers who received various intervention programs.',
            findings: 'Children who began intervention before age 2.5 showed 40% greater improvement in social communication skills compared to those starting later. Programs focusing on naturalistic play-based approaches yielded better long-term outcomes than rigid behavioral programs.',
            why: 'These findings help families make informed decisions about intervention timing and approach. Earlier support leads to better outcomes, but the type of intervention matters significantly.',
            tips: '• Seek evaluation if you notice developmental differences before age 2\n• Look for play-based, relationship-focused programs\n• Involve the whole family in intervention strategies\n• Remember that every child develops uniquely',
            technical: 'The study used standardized assessments (ADOS-2, Vineland) at baseline and 12-month intervals. Effect sizes ranged from d=0.6 to d=1.2 for various outcome measures.',
            topics: ['diagnosis', 'intervention', 'education'],
            audience: ['parents', 'professionals', 'educators'],
            ageGroups: ['early_childhood'],
            evidenceType: 'Research Study',
            source: 'Journal of Autism and Developmental Disorders',
            date: new Date('2024-11-15'),
        },
        {
            slug: 'technology-assistive-communication-devices',
            title: 'Assistive Communication Technology Opens New Doors for Non-Speaking Autistic Individuals',
            tldr: 'Modern AAC devices and apps are transforming communication for non-speaking autistic people, leading to increased independence and self-expression.',
            background: 'Approximately 25-30% of autistic individuals are non-speaking or minimally speaking. Assistive and alternative communication (AAC) technology has advanced rapidly in recent years, becoming more accessible and user-friendly.',
            findings: 'A survey of 300 non-speaking autistic individuals using AAC found that 85% experienced increased autonomy in daily life. Tablet-based AAC apps were preferred over dedicated devices due to portability and customization options. Users emphasized the importance of motor accessibility features.',
            why: 'This research validates the importance of presuming competence and providing communication access. Many non-speaking individuals have rich inner lives and important perspectives to share when given appropriate tools.',
            tips: '• Try multiple AAC options to find the best fit\n• Start early - AAC doesn\'t prevent speech development\n• Include the autistic person in device selection\n• Ensure communication partners are trained to support AAC use',
            technical: 'Survey data was analyzed using mixed-methods approach. Participants ranged in age from 5-45 years. Most commonly used apps: Proloquo2Go (42%), TouchChat (28%), LAMP Words for Life (18%).',
            topics: ['technology', 'communication', 'inclusion'],
            audience: ['parents', 'professionals', 'autistic_adults'],
            ageGroups: ['early_childhood', 'elementary', 'teens', 'adults'],
            evidenceType: 'Survey',
            source: 'Augmentative Communication Research Journal',
            date: new Date('2024-11-20'),
        },
        {
            slug: 'sensory-processing-workplace-accommodations',
            title: 'Sensory-Friendly Workplace Modifications Boost Autistic Employee Performance',
            tldr: 'Simple workplace accommodations for sensory differences improve productivity and job satisfaction for autistic employees without significant cost to employers.',
            background: 'Autistic adults face unemployment rates of 80-90%, despite many having valuable skills. Sensory processing differences often create barriers in traditional workplace environments.',
            findings: 'Companies that implemented sensory accommodations saw 65% improvement in autistic employee retention and 45% increase in performance metrics. Most effective modifications included: quiet workspaces, flexible lighting, noise-canceling headphones, and clear written communication.',
            why: 'Creating sensory-friendly workplaces benefits everyone, not just autistic employees. These accommodations often cost less than $500 per employee and improve overall workplace culture.',
            tips: '• Request specific accommodations from HR\n• Try different sensory tools to find what helps\n• Educate colleagues about sensory needs\n• Advocate for inclusive workplace design',
            technical: 'Study included 50 companies across technology, finance, and healthcare sectors. Performance measured via manager ratings and objective productivity metrics over 18-month period.',
            topics: ['inclusion', 'employment', 'sensory'],
            audience: ['autistic_adults', 'professionals', 'employers'],
            ageGroups: ['adults'],
            evidenceType: 'Workplace Study',
            source: 'Journal of Occupational Rehabilitation',
            date: new Date('2024-11-25'),
        },
        {
            slug: 'autism-girls-diagnostic-challenges',
            title: 'Autistic Girls Often Overlooked: New Diagnostic Guidelines Proposed',
            tldr: 'Research reveals that autism in girls is frequently missed due to different presentation patterns. New assessment tools aim to reduce gender bias in diagnosis.',
            background: 'Autism is diagnosed in boys 4 times more often than girls, but researchers believe many autistic girls are missed. Girls often mask autistic traits or present differently than the male-centric diagnostic criteria expect.',
            findings: 'A longitudinal study of 400 girls showed that autistic girls often develop camouflaging strategies by age 8, making autism harder to detect. Common overlooked traits include: intense imaginative play, later-emerging social difficulties, and internalized rather than externalized behaviors.',
            why: 'Late or missed diagnosis in girls leads to lack of support, increased mental health challenges, and misdiagnosis with other conditions. Better understanding helps ensure girls receive appropriate support.',
            tips: '• Trust parental concerns even if traits seem subtle\n• Look beyond stereotypical autism presentations\n• Consider camouflaging and masking behaviors\n• Assess girls in multiple settings over time',
            technical: 'Study used updated ADOS-2 protocols with gender-sensitive scoring. Participants aged 6-16 years. Inter-rater reliability κ=0.82. Sensitivity improved from 68% to 89% with modified criteria.',
            topics: ['diagnosis', 'gender_differences', 'assessment'],
            audience: ['parents', 'professionals', 'educators'],
            ageGroups: ['early_childhood', 'elementary', 'teens'],
            evidenceType: 'Research Study',
            source: 'Autism Research',
            date: new Date('2024-11-28'),
        },
        {
            slug: 'inclusive-education-academic-outcomes',
            title: 'Inclusive Education Benefits All Students, Research Confirms',
            tldr: 'Students with and without disabilities both benefit academically and socially from inclusive classroom environments.',
            background: 'The debate over inclusive versus segregated education settings continues. This comprehensive meta-analysis examined outcomes for autistic students in various educational placements.',
            findings: 'Autistic students in inclusive settings with appropriate supports showed equal or better academic progress compared to specialized settings. Non-autistic peers in inclusive classrooms demonstrated increased empathy and social awareness without academic impact.',
            why: 'This research supports inclusive education models while emphasizing the importance of adequate supports, teacher training, and individualized accommodations.',
            tips: '• Advocate for inclusion with necessary supports\n• Request teacher training on autism and differentiation\n• Ensure IEP goals address both academic and social needs\n• Build positive relationships between families and schools',
            technical: 'Meta-analysis of 67 studies (n=12,450 students). Effect size for academic outcomes in inclusive settings d=0.34 (p<0.001). Social competence gains d=0.58 (p<0.001).',
            topics: ['education', 'inclusion', 'intervention'],
            audience: ['parents', 'educators', 'professionals'],
            ageGroups: ['elementary', 'teens'],
            evidenceType: 'Meta-analysis',
            source: 'Review of Educational Research',
            date: new Date('2024-12-01'),
        },
    ];

    for (const article of articles) {
        // Check if article exists by slug
        const existingArticle = await prisma.article.findUnique({
            where: { slug: article.slug },
            select: { id: true }
        });

        if (!existingArticle) {
            console.log(`Creating article: ${article.title}`);
            await prisma.article.create({
                data: {
                    slug: article.slug,
                    title: article.title,
                    tldrSummary: article.tldr,
                    backgroundText: article.background,
                    findingsText: article.findings,
                    whyItMatters: article.why,
                    practicalTips: article.tips,
                    technicalSection: article.technical,
                    tags: ['autism', 'research'],
                    topics: article.topics,
                    audience: article.audience,
                    ageGroups: article.ageGroups,
                    evidenceType: article.evidenceType,
                    sourceUrls: ['https://example.com/research'],
                    sourceName: article.source,
                    originalPublishedDate: article.date,
                    credibilityScore: 92,
                    status: 'APPROVED',
                }
            });
        } else {
            console.log(`Article ${article.slug} already exists. Skipping.`);
        }
    }

    console.log(`✅ Articles processing completed`);

    console.log('🎉 Database seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
