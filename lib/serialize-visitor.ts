import type { VisitorRecord } from "@/types/visitor";

export function toVisitorRecord(v: {
  id: string;
  firstName: string;
  surname: string;
  phone: string;
  email: string;
  organization: string;
  hostName: string;
  hostEmail: string;
  purpose: string;
  notes: string;
  checkInAt: Date;
  checkOutAt: Date | null;
}): VisitorRecord {
  return {
    ...v,
    checkInAt: v.checkInAt.toISOString(),
    checkOutAt: v.checkOutAt?.toISOString() ?? null,
  };
}
