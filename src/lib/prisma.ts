import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Prevent Prisma initialization during build when database is not available
const createPrismaClient = () => {
    // Skip database connection during build process
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
        console.warn('Skipping Prisma Client initialization (build mode)')
        return null as any
    }

    return new PrismaClient()
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
