import { StatSummaryCard } from "@/components/StatSummaryCard";
import { VisitorLogsClient } from "@/components/VisitorLogsClient";
import { prisma } from "@/lib/prisma";
import { toVisitorRecord } from "@/lib/serialize-visitor";

export const dynamic = "force-dynamic";

export default async function AdminLogsPage() {
  const rows = await prisma.visitor.findMany({
    orderBy: { checkInAt: "desc" },
  });

  const total = rows.length;

  return (
    <main className="mx-auto w-full max-w-lg px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Visitor log</h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Every check-in since you started using this register. Export or print for records.
        </p>
        <div className="mt-6">
          <StatSummaryCard
            label="Total visits (all time)"
            value={total}
            hint="Includes completed visits and anyone still on-site."
          />
        </div>
      </div>
      <div className="mb-4 hidden print:block">
        <h1 className="text-xl font-bold">Visitor register — printed log</h1>
        <p className="text-sm text-slate-600">{new Date().toLocaleString()}</p>
        <p className="mt-1 text-sm font-semibold">Total visits: {total}</p>
      </div>
      <div className="mt-8 print:mt-4">
        <VisitorLogsClient rows={rows.map(toVisitorRecord)} />
      </div>
    </main>
  );
}
