import { CheckInForm } from "@/components/CheckInForm";
import { VisitorHeader } from "@/components/VisitorHeader";
import { getHostEmailEnvStatus } from "@/lib/site-config";

export default function HomePage() {
  const hostEmailStatus = getHostEmailEnvStatus();

  return (
    <>
      <VisitorHeader />
      <main className="mx-auto w-full max-w-lg px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Fill in each field, then tap <span className="font-semibold text-slate-800 dark:text-slate-200">Check in</span>
          . Your arrival time is saved automatically.
        </p>
        <div className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-md dark:border-slate-700/90 dark:bg-slate-900 dark:shadow-none">
          <CheckInForm hostEmailStatus={hostEmailStatus} />
        </div>
      </main>
    </>
  );
}
