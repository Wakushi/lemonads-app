import { CONTACT_EMAIL } from "@/lib/constants"
import { User } from "@/lib/types/user.type"
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
  console.log("Sending mail to ", to)
  const info = await transporter.sendMail(mailOptions)
  console.log("Mail sent to ", to)
  return info
}

export function getTemplate(
  renter: User,
  funds: string,
  parcelId: number
): string {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;">
      <div style="background-color: #ffffff; padding: 20px; max-width: 700px; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center;">
          <img src="https://peach-genuine-lamprey-766.mypinata.cloud/ipfs/QmUS842zCNWgHZUex73pTeYN8URozhrNvsXg235HmZidjM" alt="Lemonads Logo" style="width: 150px; margin-bottom: 20px;" />
        </div>
        <h1 style="color: #FFA500; text-align: center;">⚠️ Attention Needed: Low Budget Alert for Parcel #${parcelId}</h1>
        <p style="font-size: 18px;">Dear ${renter.name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We hope this message finds you well. We are reaching out to inform you that your current balance for your ad campaigns on the Lemonads platform is running low. As a result, your ad campaign for <strong>Parcel #${parcelId}</strong> may soon be paused if additional funds are not added.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          <strong>Current Balance for Parcel #${parcelId}:</strong> ${funds} ETH
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We encourage you to top up your balance to ensure that your campaign continues to run smoothly without any interruptions.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          If your balance reaches zero, your campaign for Parcel #${parcelId} will automatically be removed from the ad parcels you have rented.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Please take a moment to log in to your account and review your campaign's status. You can add more funds by visiting the <a href="https://lemonads.vercel.app/dashboard" style="color: #FFA500; text-decoration: none;">dashboard</a>.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://lemonads.vercel.app/dashboard" style="display: inline-block; background-color: #FFA500; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 18px;">Go to Dashboard</a>
        </div>
        <p style="font-size: 16px; line-height: 1.6;">
          If you have any questions or need further assistance, feel free to reach out to us at support@lemonads.com.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Best regards,<br/>
          The Lemonads Team
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          You are receiving this email because you have an active campaign with Lemonads.<br/>
          © 2024 Lemonads, All Rights Reserved.
        </p>
      </div>
    </body>
  </html>
  `
}
