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

                if (!username || !password) return null;

                const prisma = require("@/lib/prisma").prisma;
                const bcrypt = require("bcryptjs");

                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { email: username },
                                { username: username }
                            ]
                        }
                    });

                    if (!user || !user.passwordHash) {
                        console.log("Auth failed: User not found or no password hash");
                        return null;
                    }

                    const isValid = await bcrypt.compare(password, user.passwordHash);

                    if (!isValid) {
                        console.log("Auth failed: Invalid password");
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
})
