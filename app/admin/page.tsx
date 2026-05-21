import { HostEmailEnvNote } from "@/components/HostEmailEnvNote";
import { InsightNavCard } from "@/components/InsightNavCard";
import { prisma } from "@/lib/prisma";
import { getHostEmailEnvStatus } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const hostEmailStatus = getHostEmailEnvStatus();

  const [onSiteCount, totalVisitCount] = await Promise.all([
    prisma.visitor.count({ where: { checkOutAt: null } }),
    prisma.visitor.count(),
  ]);

  return (
    <main className="mx-auto w-full max-w-lg px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Dashboard</h1>
      <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">
        Tap a card to open that area. Counts update when you return here.
      </p>
      <div className="mt-5">
        <HostEmailEnvNote status={hostEmailStatus} />
      </div>

      <ul className="mt-8 flex flex-col gap-4">
        <li>
          <InsightNavCard
            href="/admin/active"
            eyebrow="Live"
            title="On-site visitors"
            count={onSiteCount}
            countCaption={onSiteCount === 1 ? "person checked in" : "people checked in"}
            description="See who is inside and check out from cards."
            tone="teal"
          />
        </li>
        <li>
          <InsightNavCard
            href="/admin/logs"
            eyebrow="History"
            title="Visitor log"
            count={totalVisitCount}
            countCaption="visits recorded (all time)"
            description="Full register, export to Excel, or print."
            tone="slate"
          />
        </li>
        <li>
          <InsightNavCard
            href="/admin/checkout"
            eyebrow="Action"
            title="Checkout"
            count={onSiteCount}
            countCaption={
              onSiteCount === 0
                ? "nobody to check out yet"
                : onSiteCount === 1
                  ? "1 person — tap to select"
                  : `${onSiteCount} people — tap to select`
            }
            description="Pick a visitor from the list and confirm their departure time."
            tone="amber"
          />
        </li>
        <li>
          <InsightNavCard
            href="/"
            eyebrow="Public"
            title="Visitor check-in"
            description="Open the guest check-in screen on this device or another tablet."
            tone="emerald"
            variant="outline"
          />
        </li>
      </ul>
    </main>
  );
}
