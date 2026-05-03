import { AdminNav } from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-100 pb-2 dark:bg-slate-950">
      <AdminNav />
      {children}
    </div>
  );
}

