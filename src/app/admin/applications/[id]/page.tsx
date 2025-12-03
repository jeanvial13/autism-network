import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, MapPin, Mail, Phone, FileText, Globe } from "lucide-react"
import { approveApplication, rejectApplication } from "@/actions/admin-actions"

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
    const application = await prisma.application.findUnique({
        where: { id: params.id }
    })

    if (!application) notFound()

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{application.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {application.address}, {application.city}, {application.state}, {application.country}
                    </p>
                </div>
                <div className="flex gap-3">
                    <form action={async () => {
                        'use server'
                        await rejectApplication(application.id, "No cumple con los requisitos.")
                    }}>
                        <Button variant="destructive" type="submit">
                            <XCircle className="mr-2 h-4 w-4" />
                            Rechazar
                        </Button>
                    </form>
                    <form action={async () => {
                        'use server'
                        await approveApplication(application.id)
                    }}>
                        <Button className="bg-green-600 hover:bg-green-700" type="submit">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Aprobar
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Información Profesional</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Profesión</label>
                                    <p className="text-lg">{application.profession}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Cédula / Licencia</label>
                                    <p className="text-lg">{application.cedula || 'N/A'}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Servicios Ofrecidos</label>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(application.services) && (application.services as string[]).map((service, i) => (
                                        <Badge key={i} variant="secondary">
                                            {service}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Institución</label>
                                <p className="text-lg">{application.institution || 'Práctica Individual'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Documentos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Certificaciones
                                </h4>
                                {application.certifications.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm">
                                        {application.certifications.map((cert, i) => (
                                            <li key={i} className="truncate">
                                                <a href={cert} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    Ver documento {i + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No se subieron certificaciones.</p>
                                )}
                            </div>

                            <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Títulos / Grados
                                </h4>
                                {application.degrees.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm">
                                        {application.degrees.map((degree, i) => (
                                            <li key={i} className="truncate">
                                                <a href={degree} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    Ver documento {i + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No se subieron títulos.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <a href={`mailto:${application.email}`} className="hover:underline truncate">
                                    {application.email}
                                </a>
                            </div>
                            {application.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${application.phone}`} className="hover:underline">
                                        {application.phone}
                                    </a>
                                </div>
                            )}
                            {application.whatsapp && (
                                <div className="flex items-center gap-3">
                                    <span className="text-green-500 font-bold text-xs">WA</span>
                                    <a href={`https://wa.me/${application.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {application.whatsapp}
                                    </a>
                                </div>
                            )}
                            {application.googleMapsUrl && (
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <a href={application.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm">
                                        Ver en Google Maps
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Ubicación</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Latitud:</strong> {application.latitude}</p>
                            <p><strong>Longitud:</strong> {application.longitude}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                * Verificar que las coordenadas coincidan con la dirección.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
