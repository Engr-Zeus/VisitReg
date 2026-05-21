import Link from "next/link";
import { formatCount } from "@/lib/format-count";

type Tone = "teal" | "slate" | "amber" | "emerald";

const toneAccent: Record<Tone, string> = {
  teal: "group-hover:border-teal-300 group-active:border-teal-400",
  slate: "group-hover:border-slate-300 group-active:border-slate-400",
  amber: "group-hover:border-amber-300 group-active:border-amber-400",
  emerald: "group-hover:border-emerald-300 group-active:border-emerald-400",
};

const countColor: Record<Tone, string> = {
  teal: "text-teal-700 dark:text-teal-400",
  slate: "text-slate-800 dark:text-slate-100",
  amber: "text-amber-700 dark:text-amber-400",
  emerald: "text-emerald-700 dark:text-emerald-400",
};

type Props = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  count?: number;
  countCaption?: string;
  tone?: Tone;
  variant?: "solid" | "outline";
};

export function InsightNavCard({
  href,
  eyebrow,
  title,
  description,
  count,
  countCaption,
  tone = "teal",
  variant = "solid",
}: Props) {
  const base =
    variant === "outline"
      ? "border-2 border-dashed border-slate-300 bg-slate-50/80 dark:border-slate-600 dark:bg-slate-900/40"
      : "border border-slate-200/90 bg-white shadow-sm dark:border-slate-700/90 dark:bg-slate-900";

  return (
    <Link
      href={href}
      className={`group relative block touch-manipulation rounded-2xl p-5 no-underline outline-none ring-teal-500/40 transition active:scale-[0.99] ${base} ${toneAccent[tone]} focus-visible:ring-2 dark:shadow-none`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            {eyebrow}
          </p>
          <h2 className="mt-1.5 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">{title}</h2>
          {count !== undefined ? (
            <p
              className={`mt-3 text-4xl font-bold tabular-nums tracking-tight ${countColor[tone]}`}
              aria-label={`${countCaption ?? title}: ${count}`}
            >
              {formatCount(count)}
            </p>
          ) : null}
          {countCaption ? (
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{countCaption}</p>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <span
          className="shrink-0 pt-1 text-2xl font-light text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-teal-600 dark:text-slate-600 dark:group-hover:text-teal-400"
          aria-hidden
        >
          →
        </span>
      </div>
    </Link>
  );
}
