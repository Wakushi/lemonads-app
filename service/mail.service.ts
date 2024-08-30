import { CONTACT_EMAIL } from "@/lib/constants"
import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendMail({
  to,
  subject,
  template,
}: {
  to: string
  subject: string
  template: string
}) {
  const mailOptions: Mail.Options = {
    from: CONTACT_EMAIL,
    to: to,
    subject,
    html: template,
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}

export function getTemplate(): string {
  return `
  <html>
    <body>
      <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px; max-width:700px; margin: 0 auto;">
        <h1>Lemonads</h1>
      </div>
    </body>
  </html>
`
}
