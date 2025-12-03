import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, FileText, XCircle, CheckCircle, Clock } from "lucide-react"

export default async function AdminDashboard() {
    const session = await auth()

    // Fetch stats (mocked for now if DB not reachable, but trying real query)
    // Note: If DB migration failed, this might error. 
    // But we generated client, so types should be fine.
    // We'll wrap in try/catch to be safe during dev if DB is down.

    let stats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        totalProfessionals: 0
    }

    try {
        const [pending, approved, rejected, professionals] = await Promise.all([
            prisma.application.count({ where: { status: 'PENDING' } }),
            prisma.application.count({ where: { status: 'APPROVED' } }),
            prisma.application.count({ where: { status: 'REJECTED' } }),
            prisma.professionalProfile.count()
        ])
        stats = { pending, approved, rejected, totalProfessionals: professionals }
    } catch (e) {
        console.error("Failed to fetch admin stats", e)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Bienvenido de nuevo, {session?.user?.name || 'Admin'}.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="text-xs text-muted-foreground">Requieren revisión</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profesionales Aprobados</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProfessionals}</div>
                        <p className="text-xs text-muted-foreground">Activos en la plataforma</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solicitudes Rechazadas</CardTitle>
                        <XCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.rejected}</div>
                        <p className="text-xs text-muted-foreground">Total histórico</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card">
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Link href="/admin/applications">
                            <Button className="w-full h-24 text-lg" variant="outline">
                                <FileText className="mr-2 h-6 w-6" />
                                Ver Solicitudes
                            </Button>
                        </Link>
                        <Link href="/admin/pictograms">
                            <Button className="w-full h-24 text-lg" variant="outline">
                                <Users className="mr-2 h-6 w-6" />
                                Administrar Pictogramas
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
