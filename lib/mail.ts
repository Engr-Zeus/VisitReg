import nodemailer from "nodemailer";

export async function notifyHostOfCheckIn(params: {
  hostEmail: string;
  visitorName: string;
  organization: string;
  purpose: string;
  checkInAt: Date;
  visitorEmail: string;
  visitorPhone: string;
  notes: string;
}): Promise<{ sent: boolean; error?: string }> {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    return { sent: false };
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.SMTP_FROM?.trim() || user || "visitor-register@localhost";

  if (!user || !pass) {
    return {
      sent: false,
      error: "SMTP_HOST is set but SMTP_USER or SMTP_PASSWORD is missing.",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const when = params.checkInAt.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const text = [
    `A visitor has checked in to see you.`,
    ``,
    `Visitor: ${params.visitorName}`,
    `Organization: ${params.organization}`,
    `Email: ${params.visitorEmail}`,
    `Phone: ${params.visitorPhone}`,
    `Purpose: ${params.purpose}`,
    `Check-in: ${when}`,
    params.notes ? `Notes: ${params.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await transporter.sendMail({
      from,
      to: params.hostEmail,
      subject: `Visitor check-in: ${params.visitorName}`,
      text,
    });
    return { sent: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown email error";
    return { sent: false, error: message };
  }
}


// This function is used to send a confirmation email to the host when the visitor checks in and the host is an admin user. It includes links for the host to confirm or decline seeing the visitor, and provides details about the visitor and their check-in time.
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ sent: boolean; error?: string }> {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) {
    return { sent: false, error: "SMTP not configured" };
  }

  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.SMTP_FROM?.trim() || user || "visitor-register@localhost";

  if (!user || !pass) {
    return {
      sent: false,
      error: "SMTP_USER or SMTP_PASSWORD is missing.",
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown email error";
    return { sent: false, error: message };
  }
}
