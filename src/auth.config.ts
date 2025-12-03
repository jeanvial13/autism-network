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
            const isOnProtected = ['/map/add', '/pictogramas'].some(path => nextUrl.pathname.startsWith(path))

            if (isOnAdmin || isOnProtected) {
                if (nextUrl.pathname === '/admin/login') {
                    if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl))
                    return true
                }
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // return Response.redirect(new URL('/dashboard', nextUrl))
            }
            return true
        },
    },
} satisfies NextAuthConfig
