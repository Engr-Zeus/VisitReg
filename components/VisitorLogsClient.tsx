"use client";

import type { VisitorRecord } from "@/types/visitor";

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function LogField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words text-base text-slate-900 dark:text-slate-100">{value || "—"}</p>
    </div>
  );
}

export function VisitorLogsClient({ rows }: { rows: VisitorRecord[] }) {
  function printLogs() {
    window.print();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 print:hidden">
        <a
          href="/api/visitors/export"
          className="touch-manipulation inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-center text-base font-bold text-white shadow-md active:bg-emerald-800"
        >
          Export Excel
        </a>
        <button
          type="button"
          onClick={printLogs}
          className="touch-manipulation inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base font-bold text-slate-800 active:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:active:bg-slate-800"
        >
          Print
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-600 dark:bg-slate-900">
          <p className="text-base font-medium text-slate-700 dark:text-slate-300">No visits recorded yet.</p>
        </div>
      ) : (
        <>
          <div id="visitor-log-cards" className="print:hidden">
            <ul className="flex flex-col gap-4">
              {rows.map((v) => (
                <li key={v.id}>
                  <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-none">
                    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                        {v.firstName} {v.surname}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{v.organization}</p>
                    </div>
                    <div className="px-4 py-1">
                      <LogField label="Phone" value={v.phone} />
                      <LogField label="Email" value={v.email} />
                      <LogField label="Host" value={v.hostName} />
                      <LogField label="Host email" value={v.hostEmail} />
                      <LogField label="Purpose" value={v.purpose} />
                      <LogField label="Notes" value={v.notes} />
                      <LogField label="Check-in" value={formatWhen(v.checkInAt)} />
                      <LogField label="Check-out" value={formatWhen(v.checkOutAt)} />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          <div id="visitor-log-print" className="hidden print:block">
            <table className="w-full border-collapse text-left text-[10px] leading-tight">
              <thead>
                <tr className="border-b border-black">
                  <th className="p-1 font-semibold">First</th>
                  <th className="p-1 font-semibold">Surname</th>
                  <th className="p-1 font-semibold">Phone</th>
                  <th className="p-1 font-semibold">Email</th>
                  <th className="p-1 font-semibold">Org</th>
                  <th className="p-1 font-semibold">Host</th>
                  <th className="p-1 font-semibold">Host email</th>
                  <th className="p-1 font-semibold">Purpose</th>
                  <th className="p-1 font-semibold">Notes</th>
                  <th className="p-1 font-semibold">In</th>
                  <th className="p-1 font-semibold">Out</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr key={v.id} className="border-b border-zinc-300 align-top">
                    <td className="p-1">{v.firstName}</td>
                    <td className="p-1">{v.surname}</td>
                    <td className="p-1 whitespace-nowrap">{v.phone}</td>
                    <td className="p-1 break-all">{v.email}</td>
                    <td className="p-1">{v.organization}</td>
                    <td className="p-1">{v.hostName}</td>
                    <td className="p-1 break-all">{v.hostEmail}</td>
                    <td className="p-1 max-w-[120px]">{v.purpose}</td>
                    <td className="p-1 max-w-[100px]">{v.notes}</td>
                    <td className="p-1 whitespace-nowrap">{formatWhen(v.checkInAt)}</td>
                    <td className="p-1 whitespace-nowrap">{formatWhen(v.checkOutAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
