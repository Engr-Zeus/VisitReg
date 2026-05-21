import Link from "next/link";
import { AdminCheckoutClient } from "@/components/AdminCheckoutClient";
import { StatSummaryCard } from "@/components/StatSummaryCard";
import { prisma } from "@/lib/prisma";
import { toVisitorRecord } from "@/lib/serialize-visitor";

export const dynamic = "force-dynamic";

export default async function AdminCheckoutPage() {
  const rows = await prisma.visitor.findMany({
    where: { checkOutAt: null, status: "APPROVED" },
    orderBy: { checkInAt: "desc" },
  });

  const count = rows.length;

  return (
    <main className="mx-auto w-full max-w-lg px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Checkout</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">
        Choose who is leaving, then confirm. You can also check people out from{" "}
        <Link href="/admin/requests" className="font-semibold text-teal-700 underline dark:text-teal-400">
          On-site
        </Link>
        .
      </p>

      <div className="mt-6">
        <StatSummaryCard
          label="Selectable (on-site)"
          value={count}
          hint={count === 0 ? "No active visits" : "Pick one below"}
        />
      </div>

      <div className="mt-8">
        <AdminCheckoutClient initial={rows.map(toVisitorRecord)} />
      </div>
    </main>
  );
}
