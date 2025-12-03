import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default async function ApplicationsPage() {
    const applications = await prisma.application.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Solicitudes Pendientes</h2>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                    {applications.length} Pendientes
                </Badge>
            </div>

            <div className="grid gap-4">
                {applications.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No hay solicitudes pendientes en este momento.
                        </CardContent>
                    </Card>
                ) : (
                    applications.map((app) => (
                        <Card key={app.id} className="glass-card hover:bg-white/50 dark:hover:bg-black/50 transition-colors">
                            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">{app.name}</h3>
                                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                        <span>{app.city}, {app.state}</span>
                                        <span>•</span>
                                        <span>{app.profession}</span>
                                        <span>•</span>
                                        <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        {Array.isArray(app.services) && (app.services as string[]).slice(0, 3).map((service, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">
                                                {service}
                                            </Badge>
                                        ))}
                                        {Array.isArray(app.services) && (app.services as string[]).length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{(app.services as string[]).length - 3} más
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Link href={`/admin/applications/${app.id}`}>
                                    <Button>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Revisar
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
