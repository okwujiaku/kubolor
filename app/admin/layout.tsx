import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Admin
            </p>
            <h1 className="text-2xl font-semibold">Kubolor Control Center</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/admin" className="hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/posts" className="hover:text-foreground">
              Posts
            </Link>
            <Link href="/admin/posts/new" className="hover:text-foreground">
              New Post
            </Link>
            <Link href="/admin/ai" className="hover:text-foreground">
              AI Generator
            </Link>
          </nav>
        </header>
        <div className="rounded-3xl border bg-background p-8">{children}</div>
      </div>
    </div>
  );
}
