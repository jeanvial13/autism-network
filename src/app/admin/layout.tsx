import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    Settings,
    Bell
} from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user || session.user.email !== process.env.ADMIN_USER) {
        redirect("/admin/login")
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 dark:bg-black/80 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        T-Conecta Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/applications">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            Solicitudes
                        </Button>
                    </Link>
                    <Link href="/admin/pictograms">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Pictogramas
                        </Button>
                    </Link>
                    <Link href="/admin/notifications">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Bell className="h-4 w-4" />
                            Notificaciones
                        </Button>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                            {session.user.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">Admin</p>
                        </div>
                    </div>
                    <form action={async () => {
                        'use server'
                        const { signOut } = await import("@/auth")
                        await signOut({ redirectTo: "/admin/login" })
                    }}>
                        <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
