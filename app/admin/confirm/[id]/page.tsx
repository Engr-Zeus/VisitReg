"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const btnBase = "w-full rounded-xl py-4 font-bold transition-all disabled:opacity-50 active:scale-[0.98]";
const inputField = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white";

export default function HostConfirmationPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // States for the new inputs
  const [view, setView] = useState<"actions" | "wait" | "reschedule">("actions");
  const [customWait, setCustomWait] = useState("10");
  const [rescheduleDate, setRescheduleDate] = useState("");

  async function sendDecision(status: string, waitTime?: number, rescheduleTime?: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/visitors/confirm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          visitorId: id, 
          status, 
          waitTime, 
          // CHANGE THIS LINE: Ensure the key is 'rescheduleDate' 
          // to match your new Prisma column
          rescheduleDate: rescheduleTime 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed");
      }

      setResult(status === "WAITING" ? `Wait ${waitTime}m` : status === "RESCHEDULED" ? `Rescheduled` : status);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  
  // decision result 
  if (result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          {/* Top Status Header */}
          <div className={`flex flex-col items-center py-10 px-6 text-center ${
            result.includes("APPROVED") ? "bg-emerald-50/50 dark:bg-emerald-500/5" : 
            result.includes("DECLINED") ? "bg-red-50/50 dark:bg-red-500/5" : 
            "bg-amber-50/50 dark:bg-amber-500/5"
          }`}>
            <div className={`flex h-16 w-16 items-center justify-center rounded-full shadow-sm ring-8 ${
              result.includes("APPROVED") ? "bg-emerald-500 text-white ring-emerald-50 dark:ring-emerald-900/20" : 
              result.includes("DECLINED") ? "bg-red-500 text-white ring-red-50 dark:ring-red-900/20" : 
              "bg-amber-500 text-white ring-amber-50 dark:ring-amber-900/20"
            }`}>
              {result.includes("APPROVED") ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : result.includes("DECLINED") ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Response Recorded
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              The security desk has been notified of your decision.
            </p>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Action taken:</span>
                <span className={`rounded-lg px-3 py-1 text-sm font-bold uppercase tracking-wider ${
                  result.includes("APPROVED") ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : 
                  result.includes("DECLINED") ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : 
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {result}
                </span>
              </div>
            </div>
            
            <p className="mt-6 text-center text-xs text-slate-400">
              You may now close this tab or window.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Visitor Response</h1>
        
        <div className="mt-8 space-y-4">
          {view === "actions" && (
            <>
              <button onClick={() => sendDecision("APPROVED")} disabled={loading} className={`${btnBase} bg-teal-700 text-white`}>
                Approve & Entry
              </button>
              
              <button onClick={() => setView("wait")} className={`${btnBase} border border-amber-200 bg-amber-50 text-amber-700`}>
                I'll be ready in...
              </button>

              <button onClick={() => setView("reschedule")} className={`${btnBase} border border-slate-200 bg-slate-50 text-slate-600`}>
                Reschedule Visit
              </button>
            </>
          )}

          {/* 1. Custom Waiting Time Picker */}
          {view === "wait" && (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-600">Minutes until you are ready:</label>
              <input 
                type="number" 
                value={customWait} 
                onChange={(e) => setCustomWait(e.target.value)}
                className={inputField}
                placeholder="e.g. 15"
              />
              <button 
                onClick={() => sendDecision("WAITING", parseInt(customWait))} 
                disabled={loading} 
                className={`${btnBase} bg-amber-600 text-white`}
              >
                Confirm Wait Time
              </button>
              <button onClick={() => setView("actions")} className="w-full text-sm text-slate-400">Cancel</button>
            </div>
          )}

          {/* 2. Reschedule with Date Picker */}
          {view === "reschedule" && (
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-600">Suggest a new date/time:</label>
              <input 
                type="datetime-local" 
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                className={inputField}
              />
              <button 
                onClick={() => sendDecision("RESCHEDULED", undefined, rescheduleDate)} 
                disabled={!rescheduleDate || loading} 
                className={`${btnBase} bg-slate-800 text-white`}
              >
                Send Reschedule Proposal
              </button>
              <button onClick={() => setView("actions")} className="w-full text-sm text-slate-400">Cancel</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}