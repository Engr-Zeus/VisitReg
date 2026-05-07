"use client";

import { useState, useEffect } from "react";
import type { HostEmailEnvStatus } from "@/lib/site-config";

// Interface for the admin data coming from the API[cite: 10]
interface AdminUser {
  id: string;
  name: string;
  email: string;
}

const label = "mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300";
const field =
  "w-full min-h-[3rem] rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none ring-teal-500/30 placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-teal-500";

export function CheckInForm({ hostEmailStatus }: { hostEmailStatus: HostEmailEnvStatus }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // States for dynamic host lookup[cite: 4]
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [hostName, setHostName] = useState("");
  const [selectedHostEmail, setSelectedHostEmail] = useState("");

  // Fetch the live list of hosts from the API on mount[cite: 4]
  useEffect(() => {
    async function loadHosts() {
      try {
        const res = await fetch("/api/admins");
        if (res.ok) {
          const data = await res.json();
          setAdmins(data);
        }
      } catch (err) {
        console.error("Failed to load hosts:", err);
      }
    }
    loadHosts();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      firstName: fd.get("firstName"),
      surname: fd.get("surname"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      organization: fd.get("organization"),
      hostName: fd.get("hostName"),
      hostEmail: fd.get("hostEmail"),
      purpose: fd.get("purpose"),
      notes: fd.get("notes"),
    };

    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const detail =
          typeof data.error === "string"
            ? data.error
            : Array.isArray(data.missing)
              ? `Missing: ${data.missing.join(", ")}`
              : "Could not check in";
        setMessage({ type: "err", text: detail });
        return;
      }

      const checkIn = data.visitor?.checkInAt
        ? new Date(data.visitor.checkInAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "";

      let extra = "";
      if (data.hostNotified) extra = " Host was notified by email.";
      else if (data.hostNotifySkipped)
        extra = " Host email was not sent (no SMTP configured — see .env.example).";
      else if (data.hostNotifyError) extra = ` Host email was not sent: ${data.hostNotifyError}`;

      setMessage({
        type: "ok",
        text: `Checked in at ${checkIn}.${extra}`,
      });
      
      // Reset form states[cite: 4, 13]
      form.reset();
      setHostName("");
      setSelectedHostEmail("");
    } catch {
      setMessage({ type: "err", text: "Network error — try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <section className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Your details</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className={label} htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" className={field} required autoComplete="given-name" />
          </div>
          <div>
            <label className={label} htmlFor="surname">Surname</label>
            <input id="surname" name="surname" className={field} required autoComplete="family-name" />
          </div>
          <div>
            <label className={label} htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" type="tel" inputMode="tel" className={field} required autoComplete="tel" />
          </div>
          <div>
            <label className={label} htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" inputMode="email" className={field} required autoComplete="email" />
          </div>
          <div>
            <label className={label} htmlFor="organization">Organization</label>
            <input id="organization" name="organization" className={field} required />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Visit</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className={label} htmlFor="hostName">Host / person to visit</label>
            <input
              id="hostName"
              name="hostName"
              list="admin-suggestions"
              className={field}
              placeholder="Type to search for a host..."
              required
              value={hostName}
              onChange={(e) => {
                const value = e.target.value;
                setHostName(value);

                // Find match in the database list[cite: 10]
                const admin = admins.find(
                  (a) => a.name.toLowerCase() === value.trim().toLowerCase()
                );
                setSelectedHostEmail(admin ? admin.email : "");
              }}
            />
            <datalist id="admin-suggestions">
              {admins.map((admin) => (
                <option key={admin.id} value={admin.name} />
              ))}
            </datalist>
          </div>

          <div>
            <label className={label} htmlFor="hostEmail">Host email</label>
            <input
              id="hostEmail"
              name="hostEmail"
              type="email"
              className={`${field} bg-slate-100 dark:bg-slate-900 cursor-not-allowed`}
              value={selectedHostEmail}
              readOnly 
              required
              placeholder="Host email will appear here"
            />
          </div>

          <div>
            <label className={label} htmlFor="purpose">Purpose</label>
            <textarea id="purpose" name="purpose" className={`${field} min-h-[6.5rem] resize-y`} rows={4} required />
          </div>
          <div>
            <label className={label} htmlFor="notes">
              Additional notes <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea id="notes" name="notes" className={`${field} min-h-[4.5rem] resize-y`} rows={2} />
          </div>
        </div>
      </section>

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Check-in time is recorded when you submit.
        {hostEmailStatus === "ready" ? " Your host may receive an email at the address above." : null}
      </p>

      {message && (
        <div
          role="status"
          className={
            message.type === "ok"
              ? "rounded-xl border border-emerald-200/80 bg-emerald-50 px-4 py-4 text-base text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100"
              : "rounded-xl border border-red-200/80 bg-red-50 px-4 py-4 text-base text-red-950 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100"
          }
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="touch-manipulation rounded-xl bg-teal-700 px-4 py-4 text-base font-bold text-white shadow-md active:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-teal-600 dark:active:bg-teal-700"
      >
        {submitting ? "Checking in…" : "Check in"}
      </button>
    </form>
  );
}