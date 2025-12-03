'use server'

import { prisma } from "@/lib/prisma"
import { sendEmail, emailTemplates } from "@/lib/email"
import { revalidatePath } from "next/cache"

export async function submitApplication(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const city = formData.get('city') as string
    const profession = formData.get('profession') as string
    const phone = formData.get('phone') as string

    // Basic validation
    if (!name || !email || !city || !profession) {
        return { error: 'Faltan campos requeridos' }
    }

    try {
        await prisma.application.create({
            data: {
                name,
                email,
                city,
                profession,
                phone,
                status: 'PENDING',
                // Add other fields as needed or allow them to be optional/updated later
                // For the dual form, we might keep it simple or add more fields
            }
        })

        // Send email to admin
        await sendEmail({
            to: process.env.ADMIN_USER || 'admin@example.com', // Fallback
            subject: 'Nueva solicitud recibida',
            html: emailTemplates.adminNewApplication(name, city)
        })

        // Send confirmation to applicant
        await sendEmail({
            to: email,
            subject: 'Solicitud recibida — T-Conecta Autismo',
            html: emailTemplates.applicationReceived(name)
        })

        // Create notification
        await prisma.notification.create({
            data: {
                type: 'APPLICATION_NEW',
                title: 'Nueva Solicitud',
                message: `${name} ha enviado una solicitud desde ${city}.`,
                link: '/admin/applications'
            }
        })

        return { success: true }
    } catch (error) {
        console.error('Error submitting application:', error)
        return { error: 'Error al enviar la solicitud' }
    }
}

export async function sendContactMessage(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { error: 'Faltan campos requeridos' }
    }

    // Here we would send an email to support or admin
    // For now, just log it or send to admin
    await sendEmail({
        to: process.env.ADMIN_USER || 'admin@example.com',
        subject: `Nuevo mensaje de contacto de ${name}`,
        html: `
      <h1>Nuevo Mensaje</h1>
      <p><strong>De:</strong> ${name} (${email})</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `
    })

    return { success: true }
}
