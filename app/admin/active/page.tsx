import Link from "next/link";
import { ActiveVisitorsClient } from "@/components/ActiveVisitorsClient";
import { StatSummaryCard } from "@/components/StatSummaryCard";
import { prisma } from "@/lib/prisma";
import { toVisitorRecord } from "@/lib/serialize-visitor";

export const dynamic = "force-dynamic";

export default async function AdminActivePage() {
  const rows = await prisma.visitor.findMany({
    where: { checkOutAt: null },
    orderBy: { checkInAt: "desc" },
  });

  const count = rows.length;

  return (
    <main className="mx-auto w-full max-w-lg px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">On-site visitors</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">
        Tap <strong className="text-slate-800 dark:text-slate-200">Check out</strong> when someone leaves. Time is
        captured at the tap. Or use{" "}
        <Link href="/admin/checkout" className="font-semibold text-teal-700 underline dark:text-teal-400">
          Checkout
        </Link>{" "}
        to pick from a list.
      </p>

      <div className="mt-6">
        <StatSummaryCard
          label="Currently inside"
          value={count}
          hint={count === 0 ? "Waiting for check-ins" : count === 1 ? "One guest on-site" : `${count} guests on-site`}
        />
      </div>

      <div className="mt-8">
        <ActiveVisitorsClient initial={rows.map(toVisitorRecord)} />
      </div>
    </main>
  );
}
