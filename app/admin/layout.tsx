import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminStatus } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminUserMenu } from "@/components/admin/AdminUserMenu";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isAdmin } = await getAdminStatus();

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
            <AdminNav />
          </aside>
          <main className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
