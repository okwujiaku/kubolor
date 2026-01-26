import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostActions } from "@/components/admin/PostActions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  let posts: Array<{
    id: string;
    title: string;
    status: string;
    updatedAt: Date;
    publishedAt: Date | null;
    category: { name: string } | null;
  }> = [];

  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  } catch (error) {
    console.error("Admin posts fetch failed:", error);
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-horizon text-xl font-semibold text-white">
            All posts
          </h2>
          <p className="text-sm text-slate-300">
            Manage drafts, scheduled, and published posts.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-full border border-blue-400/40 px-4 py-2 text-sm text-blue-200 transition hover:border-blue-300 hover:text-blue-100"
        >
          Create post
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length ? (
              posts.map((post) => (
                <tr key={post.id} className="border-t border-slate-800">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium text-white hover:text-blue-300"
                    >
                      {post.title}
                    </Link>
                    {post.publishedAt ? (
                      <p className="mt-1 text-xs text-slate-400">
                        Published {post.publishedAt.toDateString()}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs capitalize ${
                        post.status === "published"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : post.status === "draft"
                            ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-200"
                            : "border-slate-600/40 bg-slate-800/60 text-slate-300"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {post.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {post.updatedAt.toDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <PostActions postId={post.id} status={post.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
