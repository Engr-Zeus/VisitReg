import { prisma } from "@/lib/prisma";
import Link from "next/link";
// import { AdminNav } from "@/components/AdminNav";

export default async function VisitorRequestsPage() {
  // Fetch all visitors, newest first
  const visitors = await prisma.visitor.findMany({
    orderBy: { createdAt: "desc" },
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "DECLINED": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "WAITING": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-12 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Visitor Requests</h1>
          <span className="text-sm text-slate-500">{visitors.length} total entries</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Visitor</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Host</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{v.firstName} {v.surname}</div>
                    <div className="text-xs text-slate-500">{v.organization}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {v.hostName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(v.status)}`}>
                      {v.status} {v.waitTime ? `(${v.waitTime}m)` : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/requests/${v.id}`}
                      className="text-sm font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visitors.length === 0 && (
            <div className="py-20 text-center text-slate-500">No visitor requests found.</div>
          )}
        </div>
      </div>
    </main>
  );
}