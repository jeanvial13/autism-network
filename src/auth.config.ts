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
        authorized({ auth, request }) {
            const { nextUrl } = request
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            const isOnAdmin = nextUrl.pathname.startsWith('/admin')
            const isOnProtected = ['/map/add', '/pictogramas', '/profile'].some(path => nextUrl.pathname.startsWith(path))

            // Robustly determine base URL, preferring headers for proxy support
            let baseUrl = nextUrl.origin
            const forwardedHost = request.headers?.get('x-forwarded-host')
            const forwardedProto = request.headers?.get('x-forwarded-proto')

            if (forwardedHost) {
                // Handle comma-separated values (take the first one)
                const host = forwardedHost.split(',')[0].trim()
                const proto = forwardedProto ? forwardedProto.split(',')[0].trim() : 'https'
                baseUrl = `${proto}://${host}`
            }

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
