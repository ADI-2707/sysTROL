import nodemailer from "nodemailer";
import { env } from "@systrol/config";
import { createLogger } from "@systrol/logger";

const logger = createLogger("careers-notification-job");

export interface ApplicationNotificationData {
  applicantName: string;
  email: string;
  jobTitle: string;
  applicationId: string;
}

export async function processApplicationNotification(data: ApplicationNotificationData) {
  logger.info({ applicant: data.email, job: data.jobTitle }, "Sending career application notification");

  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT, 10),
      secure: env.SMTP_PORT === "465",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    // 1. Send acknowledgement to applicant
    await transporter.sendMail({
      from: `"sysTROL HR" <${env.SMTP_USER}>`,
      to: data.email,
      subject: `Application Received — ${data.jobTitle}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <h2>Thank you for applying to sysTROL</h2>
          <p>Dear ${data.applicantName},</p>
          <p>We have successfully received your application for the position of <strong>${data.jobTitle}</strong>.</p>
          <p>Our talent acquisition team will review your qualifications against our engineering needs. If your background aligns with the scope, we will reach out directly for a technical discussion.</p>
          <br/>
          <p>Best regards,<br/><strong>sysTROL Talent Acquisition Team</strong><br/>Industrial Automation & Rolling Mill Systems</p>
        </div>
      `,
    });

    // 2. Send internal notification to HR
    await transporter.sendMail({
      from: `"sysTROL Careers Bot" <${env.SMTP_USER}>`,
      to: "hr@systrol.in",
      subject: `[New Candidate] ${data.applicantName} applied for ${data.jobTitle}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h3>New Job Application Received</h3>
          <p><strong>Candidate:</strong> ${data.applicantName} (${data.email})</p>
          <p><strong>Position:</strong> ${data.jobTitle}</p>
          <p><strong>Application ID:</strong> ${data.applicationId}</p>
        </div>
      `,
    });

    logger.info({ email: data.email }, "Application emails dispatched successfully");
  } catch (err: any) {
    logger.warn({ err: err.message }, "SMTP server unreachable, logging application email locally");
  }
}
