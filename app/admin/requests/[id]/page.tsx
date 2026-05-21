import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const visitor = await prisma.visitor.findUnique({
    where: { id: params.id },
  });

  if (!visitor) notFound();

  const infoRow = (label: string, value: string | React.ReactNode) => (
    <div className="py-3 flex justify-between border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{value || "N/A"}</span>
    </div>
  );

  // Formatting dates for better readability
  const formatDate = (date: Date) => 
    new Date(date).toLocaleDateString(undefined, { 
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' 
    });
    
  const formatTime = (date: Date) => 
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <main className="min-h-screen bg-slate-50 pb-12 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <Link href="/admin/requests" className="text-sm font-medium text-teal-600 hover:text-teal-700 mb-6 inline-block transition-colors">
          ← Back to Requests
        </Link>
        
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Status Header Section */}
          <div className={`p-8 border-b border-slate-100 dark:border-slate-800 ${
            visitor.status === "APPROVED" ? "bg-emerald-50/30" : 
            visitor.status === "WAITING" ? "bg-amber-50/30" : 
            visitor.status === "RESCHEDULED" ? "bg-slate-50/50" : ""
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Visit Status</h1>
                <p className="text-sm text-slate-500 mt-1">Requested on {formatDate(visitor.createdAt)} at {formatTime(visitor.createdAt)}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-sm tracking-wide ${
                visitor.status === "APPROVED" ? "bg-emerald-500 text-white" : 
                visitor.status === "WAITING" ? "bg-amber-500 text-white" : 
                "bg-amber-500 text-amber-800 text-white"
              }`}>
                {visitor.status}
              </div>
            </div>

            {/* NEW: Conditional Alerts for Decisions */}
            {visitor.status === "WAITING" && visitor.waitTime && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-amber-100/50 p-4 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-sm font-bold">Host requested to wait for {visitor.waitTime} minutes.</p>
              </div>
            )}

            {visitor.status === "RESCHEDULED" && visitor.rescheduleDate && (
            <div className="mt-6 rounded-2xl bg-slate-100 p-4 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <p className="text-xs uppercase font-bold tracking-widest opacity-60">Proposed New Time:</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                {new Date(visitor.rescheduleDate).toLocaleString()}
                </p>
            </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Visitor Log</h3>
              {infoRow("Full Name", `${visitor.firstName} ${visitor.surname}`)}
              {infoRow("Phone", visitor.phone)}
              {infoRow("Organization", visitor.organization)}
              {infoRow("Email", visitor.email)}
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Host Details</h3>
              {infoRow("Visiting", visitor.hostName)}
              {infoRow("Host Email", visitor.hostEmail)}
            </section>

            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Visit Intent</h3>
              <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/40">
                <p className="text-xs font-bold text-slate-400 uppercase">Purpose of Visit</p>
                <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">{visitor.purpose}</p>
              </div>
            </section>

            <section>
                <a href={`/admin/confirm/${visitor.id}`} className="text-sm text-teal-600 hover:underline">
                  Confirm Arrival & Respond to Visitor →
                </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}