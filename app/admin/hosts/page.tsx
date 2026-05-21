import { AdminRegistrationForm } from "@/components/AdminRegistrationForm";

export default function HostsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-12 dark:bg-slate-950">
      <div className="mx-auto max-w-lg px-4 pt-8">
        <AdminRegistrationForm />
      </div>
    </main>
  );
}