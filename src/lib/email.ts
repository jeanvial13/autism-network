import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: true,
})

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string
    subject: string
    html: string
}) {
    if (!process.env.EMAIL_SERVER_HOST) {
        console.log('Email server not configured. Logging email instead:')
        console.log({ to, subject, html })
        return
    }

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    })
}

export const emailTemplates = {
    applicationReceived: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Solicitud Recibida</h1>
      <p>Hola ${name},</p>
      <p>Gracias por enviar tu solicitud para unirte a T-Conecta Autismo.</p>
      <p>Nuestro equipo revisará tu información y se pondrá en contacto contigo pronto.</p>
      <br/>
      <p>Atentamente,</p>
      <p>El equipo de T-Conecta Autismo</p>
    </div>
  `,
    applicationApproved: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10B981;">¡Solicitud Aprobada!</h1>
      <p>Hola ${name},</p>
      <p>Nos complace informarte que tu perfil ha sido aprobado y ya es visible en nuestra plataforma.</p>
      <p>¡Bienvenido a la red de profesionales de T-Conecta Autismo!</p>
      <br/>
      <p>Atentamente,</p>
      <p>El equipo de T-Conecta Autismo</p>
    </div>
  `,
    applicationRejected: (name: string, reason?: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Actualización de tu Solicitud</h1>
      <p>Hola ${name},</p>
      <p>Gracias por tu interés en T-Conecta Autismo.</p>
      <p>Lamentablemente, no podemos aprobar tu solicitud en este momento.</p>
      ${reason ? `<p><strong>Razón:</strong> ${reason}</p>` : ''}
      <p>Si tienes preguntas o deseas volver a aplicar, por favor contáctanos.</p>
      <br/>
      <p>Atentamente,</p>
      <p>El equipo de T-Conecta Autismo</p>
    </div>
  `,
    adminNewApplication: (name: string, city: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Nueva Solicitud Recibida</h1>
      <p>Se ha recibido una nueva solicitud de un profesional/institución.</p>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Ciudad:</strong> ${city}</p>
      <p><a href="${process.env.NEXTAUTH_URL}/admin/dashboard">Ir al Dashboard</a></p>
    </div>
  `
}
