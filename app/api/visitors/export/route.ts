import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.visitor.findMany({
    orderBy: { checkInAt: "desc" },
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Visitor Register";
  const sheet = workbook.addWorksheet("Visitor log");

  sheet.columns = [
    { header: "First name", key: "firstName", width: 14 },
    { header: "Surname", key: "surname", width: 14 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Email", key: "email", width: 28 },
    { header: "Organization", key: "organization", width: 22 },
    { header: "Host / person to visit", key: "hostName", width: 22 },
    { header: "Host email", key: "hostEmail", width: 28 },
    { header: "Purpose", key: "purpose", width: 28 },
    { header: "Additional notes", key: "notes", width: 28 },
    { header: "Check-in", key: "checkInAt", width: 22 },
    { header: "Check-out", key: "checkOutAt", width: 22 },
  ];

  const fmt = (d: Date | null) =>
    d ? d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";

  for (const r of rows) {
    sheet.addRow({
      firstName: r.firstName,
      surname: r.surname,
      phone: r.phone,
      email: r.email,
      organization: r.organization,
      hostName: r.hostName,
      hostEmail: r.hostEmail,
      purpose: r.purpose,
      notes: r.notes,
      checkInAt: fmt(r.checkInAt),
      checkOutAt: fmt(r.checkOutAt),
    });
  }

  sheet.getRow(1).font = { bold: true };

  const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

  const filename = `visitor-log-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
