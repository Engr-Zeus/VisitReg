import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toVisitorRecord } from "@/lib/serialize-visitor";

export const dynamic = "force-dynamic";

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const existing = await prisma.visitor.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Visitor not found" }, { status: 404 });
  }
  if (existing.checkOutAt) {
    return NextResponse.json({ error: "Already checked out" }, { status: 409 });
  }

  const visitor = await prisma.visitor.update({
    where: { id },
    data: { checkOutAt: new Date() },
  });

  return NextResponse.json({ visitor: toVisitorRecord(visitor) });
}
