'use client'

import { useState } from 'react'
import { submitApplication, sendContactMessage } from '@/actions/public-actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleApplication(formData: FormData) {
        setIsSubmitting(true)
        const result = await submitApplication(formData)
        setIsSubmitting(false)
        if (result.success) {
            alert('¡Solicitud enviada con éxito! Revisa tu correo.')
            // Reset form?
        } else {
            alert(result.error || 'Hubo un error.')
        }
    }

    async function handleContact(formData: FormData) {
        setIsSubmitting(true)
        const result = await sendContactMessage(formData)
        setIsSubmitting(false)
        if (result.success) {
            alert('Mensaje enviado. Gracias por contactarnos.')
        } else {
            alert(result.error || 'Hubo un error.')
        }
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Contáctanos
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        ¿Tienes preguntas o quieres unirte a nuestra red de profesionales?
                        Elige la opción que mejor se adapte a ti.
                    </p>
                </div>

                <Tabs defaultValue="contact" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="contact">Contacto General</TabsTrigger>
                        <TabsTrigger value="application">Soy Profesional / Institución</TabsTrigger>
                    </TabsList>

                    <TabsContent value="contact">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Envíanos un mensaje</CardTitle>
                                <CardDescription>
                                    Para dudas generales, sugerencias o comentarios.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={handleContact} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-name">Nombre</Label>
                                            <Input id="contact-name" name="name" required placeholder="Tu nombre" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-email">Email</Label>
                                            <Input id="contact-email" name="email" type="email" required placeholder="tu@email.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contact-message">Mensaje</Label>
                                        <Textarea id="contact-message" name="message" required placeholder="¿En qué podemos ayudarte?" rows={5} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="application">
                        <Card className="glass-card">
                            <CardHeader>
                                <CardTitle>Únete a la Red</CardTitle>
                                <CardDescription>
                                    Postúlate para aparecer en nuestro mapa de profesionales verificados.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form action={handleApplication} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="app-name">Nombre Completo / Institución</Label>
                                            <Input id="app-name" name="name" required placeholder="Dr. Juan Pérez / Centro..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="app-profession">Profesión / Tipo</Label>
                                            <Input id="app-profession" name="profession" required placeholder="Psicólogo, Terapeuta..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="app-email">Email Profesional</Label>
                                            <Input id="app-email" name="email" type="email" required placeholder="contacto@profesional.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="app-phone">Teléfono / WhatsApp</Label>
                                            <Input id="app-phone" name="phone" placeholder="+52 555..." />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="app-city">Ciudad y Estado</Label>
                                        <Input id="app-city" name="city" required placeholder="Ciudad de México, CDMX" />
                                    </div>

                                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={isSubmitting}>
                                        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        Al enviar esta solicitud, aceptas que revisemos tus datos para verificación.
                                    </p>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
