"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { VisitorRecord } from "@/types/visitor";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-800">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-base font-medium text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}

export function ActiveVisitorsClient({ initial }: { initial: VisitorRecord[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(id: string) {
    setPendingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/visitors/${id}/checkout`, { method: "PATCH" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Checkout failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setPendingId(null);
    }
  }

  if (initial.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-600 dark:bg-slate-900">
        <p className="text-base font-medium text-slate-700 dark:text-slate-300">No one is checked in right now.</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Guests appear here after they use the check-in page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-base text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100">
          {error}
        </div>
      ) : null}

      <ul className="flex flex-col gap-4">
        {initial.map((v) => (
          <li key={v.id}>
            <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-none">
              <div className="border-b border-slate-100 bg-teal-700/5 px-4 py-3 dark:border-slate-800 dark:bg-teal-500/10">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  {v.firstName} {v.surname}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">{v.phone}</p>
              </div>
              <dl className="px-4 pb-2">
                <Row label="Organization" value={v.organization} />
                <Row label="Host" value={v.hostName} />
                <Row label="Host email" value={v.hostEmail} />
                <Row label="Checked in" value={formatWhen(v.checkInAt)} />
              </dl>
              <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => checkout(v.id)}
                  disabled={pendingId === v.id}
                  className="touch-manipulation w-full min-h-[3rem] rounded-xl bg-amber-600 px-4 py-3 text-base font-bold text-white shadow-sm active:bg-amber-700 disabled:opacity-60 dark:bg-amber-600 dark:active:bg-amber-700"
                >
                  {pendingId === v.id ? "Checking out…" : "Check out"}
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
