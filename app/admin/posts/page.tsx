import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">All posts</h2>
          <p className="text-sm text-muted-foreground">
            Manage drafts, scheduled, and published posts.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full border px-4 py-2 text-sm"
        >
          Create post
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/posts/${post.id}`}
                    className="font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-4 py-3 capitalize">{post.status}</td>
                <td className="px-4 py-3">{post.category?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  {post.updatedAt.toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
