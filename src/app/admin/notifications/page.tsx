import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, XCircle, FileText } from "lucide-react"

export default async function NotificationsPage() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Notificaciones</h2>
            </div>

            <div className="grid gap-4">
                {notifications.length === 0 ? (
                    <Card className="glass-card">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No hay notificaciones recientes.
                        </CardContent>
                    </Card>
                ) : (
                    notifications.map((notif) => (
                        <Card key={notif.id} className={`glass-card ${!notif.isRead ? 'border-blue-500/50' : ''}`}>
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className={`p-2 rounded-full ${notif.type === 'APPLICATION_NEW' ? 'bg-blue-100 text-blue-600' :
                                        notif.type === 'APPLICATION_APPROVED' ? 'bg-green-100 text-green-600' :
                                            notif.type === 'APPLICATION_REJECTED' ? 'bg-red-100 text-red-600' :
                                                'bg-gray-100 text-gray-600'
                                    }`}>
                                    {notif.type === 'APPLICATION_NEW' && <FileText className="h-4 w-4" />}
                                    {notif.type === 'APPLICATION_APPROVED' && <CheckCircle className="h-4 w-4" />}
                                    {notif.type === 'APPLICATION_REJECTED' && <XCircle className="h-4 w-4" />}
                                    {!['APPLICATION_NEW', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED'].includes(notif.type) && <Bell className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold">{notif.title}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
