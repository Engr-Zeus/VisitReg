import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Fetch all admins for the CheckInForm suggestions
export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hosts" }, { status: 500 });
  }
}

// POST: Save a new admin from the Registration Form
export async function POST(req: Request) {
  try {
    const { name, email, department } = await req.json();
    
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const newAdmin = await prisma.admin.create({
      data: { name, email, department },
    });

    return NextResponse.json(newAdmin);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create host" }, { status: 500 });
  }
}