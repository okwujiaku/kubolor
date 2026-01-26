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
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-5">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200">
              Admin Suite
            </p>
            <h1 className="font-horizon text-2xl font-semibold text-white">
              Kubolor Control Center
            </h1>
            <p className="text-sm text-slate-400">
              Manage editorial workflows, AI generation, and publishing.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-blue-400/60 hover:text-blue-200"
            >
              View site
            </Link>
            <Link
              href="/admin/posts/new"
              className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              New post
            </Link>
            <AdminUserMenu />
          </div>
        </header>

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
