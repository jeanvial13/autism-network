'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail, emailTemplates } from "@/lib/email"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized")
    }
    return session.user
}

export async function approveApplication(applicationId: string) {
    const admin = await checkAdmin()

    const application = await prisma.application.findUnique({
        where: { id: applicationId }
    })

    if (!application) throw new Error("Application not found")

    // Create User and ProfessionalProfile
    // Note: This assumes the application has enough info to create a User.
    // If not, we might need to adjust the flow.
    // For now, we'll create a User with the email and a placeholder password/random password.
    // Or maybe we just create the ProfessionalProfile linked to an existing User if they signed up?
    // The requirement says "No public signup". So we create the user here.

    const tempPassword = Math.random().toString(36).slice(-8) // Should ideally email this to them

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: application.email } })

    if (!user) {
        user = await prisma.user.create({
            data: {
                email: application.email,
                name: application.name,
                role: 'PROFESSIONAL',
                // passwordHash: ... (we need to hash it if we use credentials login for them)
                // For now, we'll leave passwordHash null/empty and assume they might reset it or we send it.
                // Or we just don't set it yet.
            }
        })
    } else {
        // Upgrade to professional
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'PROFESSIONAL' }
        })
    }

    // Create ProfessionalProfile
    await prisma.professionalProfile.create({
        data: {
            userId: user.id,
            licenseNumber: application.cedula || 'N/A',
            licenseCountry: application.country || 'Unknown',
            verificationStatus: 'VERIFIED',
            specialties: Array.isArray(application.services) ? application.services as string[] : [],
            locationLat: application.latitude,
            locationLng: application.longitude,
            approvedAt: new Date(),
            approvedBy: admin.email || 'Admin'
        }
    })

    // Update Application status
    await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'APPROVED' }
    })

    // Log action
    await prisma.adminLog.create({
        data: {
            adminUsername: admin.email || 'Admin',
            action: 'APPROVE_APPLICATION',
            targetId: applicationId,
            details: { name: application.name }
        }
    })

    // Send Email
    await sendEmail({
        to: application.email,
        subject: 'Tu solicitud ha sido aprobada - T-Conecta Autismo',
        html: emailTemplates.applicationApproved(application.name)
    })

    revalidatePath('/admin/applications')
    redirect('/admin/applications')
}

export async function rejectApplication(applicationId: string, reason: string) {
    const admin = await checkAdmin()

    const application = await prisma.application.update({
        where: { id: applicationId },
        data: {
            status: 'REJECTED',
            rejectedReason: reason,
            rejectedAt: new Date()
        }
    })

    // Log action
    await prisma.adminLog.create({
        data: {
            adminUsername: admin.email || 'Admin',
            action: 'REJECT_APPLICATION',
            targetId: applicationId,
            details: { reason }
        }
    })

    // Send Email
    await sendEmail({
        to: application.email,
        subject: 'Actualización de tu solicitud - T-Conecta Autismo',
        html: emailTemplates.applicationRejected(application.name, reason)
    })

    revalidatePath('/admin/applications')
    redirect('/admin/applications')
}
