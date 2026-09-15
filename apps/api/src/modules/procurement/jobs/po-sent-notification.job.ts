import nodemailer from "nodemailer";
import { env } from "@systrol/config";
import { createLogger } from "@systrol/logger";

const logger = createLogger("po-sent-job");

export interface POSentNotificationData {
  poId: string;
  poNumber: string;
  vendorName: string;
  vendorEmail: string;
  totalValue: string;
  expectedDeliveryDate?: string | null;
}

export async function processPOSentNotification(data: POSentNotificationData) {
  logger.info({ poNumber: data.poNumber, vendor: data.vendorName }, "Dispatching Purchase Order to vendor");

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

    await transporter.sendMail({
      from: `"sysTROL Procurement" <${env.SMTP_USER}>`,
      to: data.vendorEmail || "vendor@example.com",
      subject: `[Purchase Order Issued] ${data.poNumber} — sysTROL Industrial Systems`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <h2>Purchase Order ${data.poNumber}</h2>
          <p>Dear ${data.vendorName},</p>
          <p>Please find officially issued Purchase Order <strong>${data.poNumber}</strong> from sysTROL Automation & Machinery.</p>
          <ul>
            <li><strong>Total Value:</strong> ₹${data.totalValue}</li>
            <li><strong>Expected Delivery Date:</strong> ${data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate).toLocaleDateString() : "Standard 4-Week Lead"}</li>
          </ul>
          <p>Kindly acknowledge receipt and confirm manufacturing/dispatch schedules.</p>
          <br/>
          <p>Regards,<br/><strong>sysTROL Procurement & Supply Chain Directorate</strong></p>
        </div>
      `,
    });

    logger.info({ poNumber: data.poNumber }, "PO notification email dispatched");
  } catch (err: any) {
    logger.warn({ err: err.message }, "SMTP server unreachable, logging PO dispatch locally");
  }
}
