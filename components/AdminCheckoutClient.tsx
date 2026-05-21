"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { VisitorRecord } from "@/types/visitor";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminCheckoutClient({ initial }: { initial: VisitorRecord[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<VisitorRecord[]>(initial);
  const [selectedId, setSelectedId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  const options = useMemo(
    () =>
      [...rows].sort(
        (a, b) => new Date(a.checkInAt).getTime() - new Date(b.checkInAt).getTime(),
      ),
    [rows],
  );

  async function refresh() {
    const res = await fetch("/api/visitors?status=active");
    if (!res.ok) return;
    const data = (await res.json()) as VisitorRecord[];
    setRows(data);
    setSelectedId("");
  }

  async function checkout() {
    if (!selectedId) {
      setMessage({ type: "err", text: "Select a visitor first." });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/visitors/${selectedId}/checkout`, { method: "PATCH" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          type: "err",
          text: typeof data.error === "string" ? data.error : "Checkout failed.",
        });
        return;
      }
      const v = data.visitor as VisitorRecord | undefined;
      const out = v?.checkOutAt ? formatWhen(v.checkOutAt) : "";
      setMessage({
        type: "ok",
        text: out ? `Checked out at ${out}.` : "Checked out.",
      });
      await refresh();
      router.refresh();
    } catch {
      setMessage({ type: "err", text: "Network error — try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (options.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-600 dark:bg-slate-900">
        <p className="text-base font-medium text-slate-700 dark:text-slate-300">No one is checked in.</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Nothing to check out until a guest checks in.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-none sm:p-6">
      <div>
        <label htmlFor="checkout-visitor" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Visitor to check out
        </label>
        <select
          id="checkout-visitor"
          className="touch-manipulation w-full min-h-[3.25rem] appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setMessage(null);
          }}
        >
          <option value="">— Choose a visitor —</option>
          {options.map((v) => (
            <option key={v.id} value={v.id}>
              {v.firstName} {v.surname} · {v.organization} · in {formatWhen(v.checkInAt)}
            </option>
          ))}
        </select>
      </div>

      {message ? (
        <div
          role="status"
          className={
            message.type === "ok"
              ? "mt-4 rounded-xl border border-emerald-200/80 bg-emerald-50 px-4 py-3 text-base text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100"
              : "mt-4 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-base text-red-950 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100"
          }
        >
          {message.text}
        </div>
      ) : null}

      <button
        type="button"
        onClick={checkout}
        disabled={submitting || !selectedId}
        className="mt-6 w-full min-h-[3rem] touch-manipulation rounded-xl bg-amber-600 px-4 py-3 text-base font-bold text-white shadow-sm active:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-600 dark:active:bg-amber-700"
      >
        {submitting ? "Checking out…" : "Check out selected visitor"}
      </button>
    </div>
  );
}
