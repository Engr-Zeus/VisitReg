import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyHostOfCheckIn } from "@/lib/mail";
import { toVisitorRecord } from "@/lib/serialize-visitor";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const where =
    status === "active"
      ? { checkOutAt: null as null }
      : status === "completed"
        ? { checkOutAt: { not: null } }
        : {};

  const rows = await prisma.visitor.findMany({
    where,
    orderBy: { checkInAt: "desc" },
  });

  return NextResponse.json(rows.map(toVisitorRecord));
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const surname = String(body.surname ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const organization = String(body.organization ?? "").trim();
  const hostName = String(body.hostName ?? "").trim();
  const hostEmail = String(body.hostEmail ?? "").trim();
  const purpose = String(body.purpose ?? "").trim();
  const notes = String(body.notes ?? "").trim();

  const missing: string[] = [];
  if (!firstName) missing.push("firstName");
  if (!surname) missing.push("surname");
  if (!phone) missing.push("phone");
  if (!email) missing.push("email");
  if (!organization) missing.push("organization");
  if (!hostName) missing.push("hostName");
  if (!hostEmail) missing.push("hostEmail");
  if (!purpose) missing.push("purpose");

  if (missing.length) {
    return NextResponse.json({ error: "Missing required fields", missing }, { status: 400 });
  }

  if (!emailRe.test(email) || !emailRe.test(hostEmail)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const checkInAt = new Date();

  const visitor = await prisma.visitor.create({
    data: {
      firstName,
      surname,
      phone,
      email,
      organization,
      hostName,
      hostEmail,
      purpose,
      notes,
      checkInAt,
      status: "PENDING",
    },
  });

  const mail = await notifyHostOfCheckIn({
    visitorId: visitor.id,
    hostEmail,
    visitorName: `${firstName} ${surname}`,
    organization,
    purpose,
    checkInAt,
    visitorEmail: email,
    visitorPhone: phone,
    notes,
  });

  return NextResponse.json({
    visitor: toVisitorRecord(visitor),
    hostNotified: mail.sent,
    hostNotifySkipped: !process.env.SMTP_HOST?.trim(),
    hostNotifyError: mail.error,
  });
}

export async function PATCH(req: Request) {
  try {
    const { visitorId, status, waitTime, rescheduleDate } = await req.json();

    const updatedVisitor = await prisma.visitor.update({
      where: { id: visitorId },
      data: { 
        status, 
        waitTime: waitTime ? parseInt(waitTime.toString()) : null,
        // Convert the string from the frontend into a Date object
        rescheduleDate: (status === "RESCHEDULED" && rescheduleDate) 
          ? new Date(rescheduleDate) 
          : null
      },
    });

    return NextResponse.json(updatedVisitor);
  } catch (error: any) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}