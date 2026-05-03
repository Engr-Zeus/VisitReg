export function VisitorHeader() {
  return (
    <header className="border-b border-slate-200/90 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 print:hidden">
      <div className="mx-auto max-w-lg px-4 py-[max(0.875rem,env(safe-area-inset-top))] pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400">
          Welcome
        </p>
        <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Visitor check-in</h1>
      </div>
    </header>
  );
}
