"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const base =
  "inline-flex min-h-11 shrink-0 touch-manipulation items-center justify-center rounded-xl px-4 text-sm font-semibold transition";

function navClass(active: boolean) {
  if (active) {
    return `${base} bg-teal-700 text-white shadow-sm dark:bg-teal-600`;
  }
  return `${base} bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/80 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700`;
}

export function AdminNav() {
  const pathname = usePathname() || "";

  const dashboard = pathname === "/admin" || pathname === "/admin/";
  const active = pathname.startsWith("/admin/active");
  const checkout = pathname.startsWith("/admin/checkout");
  const logs = pathname.startsWith("/admin/logs");
  const requests = pathname.startsWith("/admin/requests");

  // hosts
  const hosts = pathname.startsWith("/admin/hosts");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 print:hidden">
      <div className="border-b border-transparent px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <Link
            href="/admin"
            className="min-h-11 touch-manipulation py-2 pr-2 text-base font-bold leading-tight text-slate-900 no-underline dark:text-slate-50"
          >
            Admin
          </Link>
          <Link
            href="/"
            className="touch-manipulation rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 no-underline dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
          >
            Guest
          </Link>
        </div>
        <nav
          className="mx-auto mt-2 flex max-w-lg gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Admin sections"
        >
          <Link href="/admin" className={navClass(dashboard)}>
            Home
          </Link>
          <Link href="/admin/requests" className={navClass(requests)}>Requests</Link>
          {/* <Link href="/admin/active" className={navClass(active)}>On-site</Link> */}
          <Link href="/admin/checkout" className={navClass(checkout)}>
            Checkout
          </Link>
          <Link href="/admin/logs" className={navClass(logs)}>
            Logs
          </Link>
          <Link href="/admin/hosts" className={navClass(hosts)}>Hosts</Link>
          
        </nav>
      </div>
    </header>
  );
}
