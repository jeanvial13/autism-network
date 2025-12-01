import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"

// Dynamically import prisma only when not in build mode
const getAdapter = () => {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
        return undefined
    }
    const { prisma } = require("@/lib/prisma")
    return PrismaAdapter(prisma)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: getAdapter(),
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async () => {
                // Add logic here to look up the user from the credentials supplied
                // For now, return null to fail or a dummy user for dev
                return null
            },
        }),
    ],
})
