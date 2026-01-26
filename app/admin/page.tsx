import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let totalPosts = 0;
  let draftPosts = 0;
  let publishedPosts = 0;
  let categoriesCount = 0;
  let tagsCount = 0;
  let aiDrafts = 0;
  let recentPosts: Array<{
    id: string;
    title: string;
    status: string;
    updatedAt: Date;
    category: { name: string } | null;
  }> = [];

  try {
    [
      totalPosts,
      draftPosts,
      publishedPosts,
      categoriesCount,
      tagsCount,
      aiDrafts,
      recentPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.post.count({ where: { status: "published" } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.aIGenerationLog.count(),
      prisma.post.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { category: true },
      }),
    ]);
  } catch (error) {
    console.error("Admin dashboard fetch failed:", error);
  }

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h2 className="font-horizon text-xl font-semibold text-white">
          Overview
        </h2>
        <p className="text-sm text-slate-300">
          Monitor content velocity, AI usage, and publishing health.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatsCard label="Total posts" value={totalPosts} />
        <StatsCard label="Drafts" value={draftPosts} />
        <StatsCard label="Published" value={publishedPosts} />
        <StatsCard label="Categories" value={categoriesCount} />
        <StatsCard label="Tags" value={tagsCount} />
        <StatsCard label="AI drafts" value={aiDrafts} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Quick actions
              </h3>
              <p className="text-sm text-slate-400">
                Jump back into your editorial workflow.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Link
              href="/admin/posts/new"
              className="rounded-xl border border-blue-400/40 bg-blue-500/10 p-4 text-sm font-semibold text-blue-200 transition hover:border-blue-300 hover:text-blue-100"
            >
              Create post
              <p className="mt-2 text-xs text-blue-200/70">
                Start a new draft
              </p>
            </Link>
            <Link
              href="/admin/ai"
              className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm font-semibold text-slate-200 transition hover:border-blue-300 hover:text-blue-200"
            >
              Generate with AI
              <p className="mt-2 text-xs text-slate-400">
                Draft a post instantly
              </p>
            </Link>
            <Link
              href="/admin/posts"
              className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm font-semibold text-slate-200 transition hover:border-blue-300 hover:text-blue-200"
            >
              Review content
              <p className="mt-2 text-xs text-slate-400">
                Manage existing posts
              </p>
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-base font-semibold text-white">Recent activity</h3>
          <p className="text-sm text-slate-400">
            Latest content updates from your team.
          </p>
          <div className="mt-4 space-y-3 text-sm">
            {recentPosts.length ? (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 transition hover:border-blue-400/40"
                >
                  <div>
                    <p className="font-semibold text-white">{post.title}</p>
                    <p className="text-xs text-slate-400">
                      {post.category?.name ?? "Uncategorized"} ·{" "}
                      {post.updatedAt.toDateString()}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs capitalize text-slate-300">
                    {post.status}
                  </span>
                </Link>
              ))
            ) : (
              <p className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-6 text-center text-sm text-slate-400">
                No posts yet. Create your first draft.
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
