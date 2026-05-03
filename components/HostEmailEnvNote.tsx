import type { HostEmailEnvStatus } from "@/lib/site-config";

const box =
  "rounded-2xl border px-4 py-4 text-sm leading-relaxed shadow-sm dark:shadow-none";

export function HostEmailEnvNote({ status }: { status: HostEmailEnvStatus }) {
  if (status === "ready") {
    return (
      <div
        className={`${box} border-emerald-200/90 bg-emerald-50 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100`}
      >
        <p className="font-semibold text-emerald-900 dark:text-emerald-50">Host email is on</p>
        <p className="mt-2 text-emerald-900/90 dark:text-emerald-100/90">
          New check-ins email the address entered in <strong>Host email</strong> on the guest form.
        </p>
      </div>
    );
  }

  if (status === "incomplete") {
    return (
      <div
        className={`${box} border-amber-200/90 bg-amber-50 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-100`}
      >
        <p className="font-semibold text-amber-900 dark:text-amber-50">SMTP incomplete</p>
        <p className="mt-2 text-amber-900/90 dark:text-amber-100/90">
          <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-xs dark:bg-amber-900/50">SMTP_HOST</code> is set;
          add <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-xs dark:bg-amber-900/50">SMTP_USER</code> and{" "}
          <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-xs dark:bg-amber-900/50">SMTP_PASSWORD</code> in{" "}
          <code className="text-xs">.env</code>.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${box} border-slate-200/90 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200`}
    >
      <p className="font-semibold text-slate-900 dark:text-slate-100">Host email is off</p>
      <p className="mt-2 text-slate-700 dark:text-slate-300">
        Visits still save. Add SMTP settings in <code className="rounded bg-white/80 px-1.5 py-0.5 text-xs dark:bg-slate-800">.env</code>{" "}
        (see <code className="text-xs">.env.example</code>) to notify hosts.
      </p>
    </div>
  );
}
