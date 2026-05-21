import { formatCount } from "@/lib/format-count";

export function StatSummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-none">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
        {formatCount(value)}
      </p>
      {hint ? <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}
