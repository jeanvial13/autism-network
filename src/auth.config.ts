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

            const baseUrl = nextUrl.origin

            if (isOnAdmin || isOnProtected) {
                if (nextUrl.pathname === '/admin/login') {
                    if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', baseUrl))
                    return true
                }
                if (isLoggedIn) return true

                // Redirect unauthenticated users to login page with correct callback URL
                const callbackUrl = encodeURIComponent(`${baseUrl}${nextUrl.pathname}`)
                const loginUrl = new URL(`${baseUrl}/login?callbackUrl=${callbackUrl}`)
                return Response.redirect(loginUrl)
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true
                // Redirect unauthenticated users to login page
                const callbackUrl = encodeURIComponent(`${baseUrl}${nextUrl.pathname}`)
                const loginUrl = new URL(`${baseUrl}/login?callbackUrl=${callbackUrl}`)
                return Response.redirect(loginUrl)
            }

            return true
        },
    },
    pages: {
        signIn: '/login',
    },
} satisfies NextAuthConfig
