import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const isOnProtected = ['/map/add', '/pictogramas', '/profile'].some(path => nextUrl.pathname.startsWith(path))

            // Helper to get absolute URL if NEXTAUTH_URL is set, otherwise use relative
            const getRedirectUrl = (path: string) => {
                const baseUrl = process.env.NEXTAUTH_URL
                if (baseUrl) {
                    return `${baseUrl}${path}`
                }
                return new URL(path, nextUrl)
            }

            if (isOnAdmin || isOnProtected) {
                if (nextUrl.pathname === '/admin/login') {
                    if (isLoggedIn) return Response.redirect(getRedirectUrl('/admin/dashboard'))
                    return true
                }
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }

            return true
        },
    },
} satisfies NextAuthConfig
