"use client";

import { useState } from "react";

const label = "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300";
const field =
  "w-full min-h-[3rem] rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none ring-teal-500/30 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-500";

export function AdminRegistrationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        department: formData.get("department"),
    };

    try {
        const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

        const data = await res.json(); //[cite: 4]

        if (!res.ok) {
        // Use the error message sent back by the API route
        throw new Error(data.error || "Failed to register host");
        }

        setMessage({ type: "ok", text: "Host registered successfully!" });
        (e.target as HTMLFormElement).reset();
    } catch (err: unknown) {
        // Log the actual error to the browser console (F12)
        console.error("Registration Error:", err);
        setMessage({ type: "err", text: err.message });
    } finally {
        setSubmitting(false);
    }
    }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-6">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-700/90 dark:bg-slate-900">
        <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-slate-50">Register New Host</h2>
        
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="name">Full Name</label>
            <input id="name" name="name" className={field} required placeholder="e.g. John Doe" />
          </div>
          
          <div>
            <label className={label} htmlFor="email">Work Email</label>
            <input id="email" name="email" type="email" className={field} required placeholder="john@company.com" />
          </div>
          
          <div>
            <label className={label} htmlFor="department">Department (Optional)</label>
            <input id="department" name="department" className={field} placeholder="e.g. Engineering" />
          </div>
        </div>

        {message && (
          <div className={`mt-6 rounded-xl border p-4 text-sm ${
            message.type === "ok" 
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100" 
              : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100"
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-8 w-full min-h-[3rem] rounded-xl bg-teal-700 px-4 py-3 text-base font-bold text-white shadow-md active:bg-teal-800 disabled:opacity-60 dark:bg-teal-600"
        >
          {submitting ? "Registering..." : "Add Host"}
        </button>
      </div>
    </form>
  );
}