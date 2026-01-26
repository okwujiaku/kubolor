import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminStatus } from "@/lib/auth";

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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200">
              Admin
            </p>
            <h1 className="font-horizon text-2xl font-semibold text-white">
              Kubolor Control Center
            </h1>
          </div>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/admin" className="hover:text-blue-300">
              Dashboard
            </Link>
            <Link href="/admin/posts" className="hover:text-blue-300">
              Posts
            </Link>
            <Link href="/admin/posts/new" className="hover:text-blue-300">
              New Post
            </Link>
            <Link href="/admin/ai" className="hover:text-blue-300">
              AI Generator
            </Link>
          </nav>
        </header>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
