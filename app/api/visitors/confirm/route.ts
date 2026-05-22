import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { visitorId, status, waitTime , rescheduleDate} = await req.json();

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 });
    }

    const updatedVisitor = await prisma.visitor.update({
      where: { id: visitorId },
      data: { 
        status: status, // "APPROVED", "DECLINED", or "WAITING"
        waitTime: waitTime || null ,
        rescheduleDate: (status === "RESCHEDULED" && rescheduleDate) 
          ? new Date(rescheduleDate) 
          : null
      },
    });

    return NextResponse.json({ success: true, visitor: updatedVisitor });
  } catch (error: unknown) {
    console.error("Confirmation API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}