import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

// Dynamically import prisma only when not in build mode
const getAdapter = () => {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
        return undefined
    }
    try {
        const { prisma } = require("@/lib/prisma")
        return PrismaAdapter(prisma)
    } catch (e) {
        console.warn("Failed to initialize Prisma Adapter:", e)
        return undefined
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    adapter: getAdapter(),
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { username, password } = credentials ?? {}

                const adminUser = process.env.ADMIN_USER
                const adminPass = process.env.ADMIN_PASS
                const adminName = process.env.ADMIN_NAME

                if (username === adminUser && password === adminPass) {
                    return {
                        id: 'admin',
                        name: adminName,
                        email: adminUser,
                        role: 'ADMIN',
                    }
                }

                return null
            },
        }),
    ],
})
