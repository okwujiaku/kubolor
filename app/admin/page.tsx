import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let totalPosts = 0;
  let draftPosts = 0;
  let publishedPosts = 0;

  try {
    [totalPosts, draftPosts, publishedPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.post.count({ where: { status: "published" } }),
    ]);
  } catch (error) {
    console.error("Admin dashboard fetch failed:", error);
  }

  return (
    <section className="space-y-8">
      <header>
        <h2 className="font-horizon text-xl font-semibold text-white">
          Overview
        </h2>
        <p className="text-sm text-slate-300">
          Track publishing status and content pipeline.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Total posts" value={totalPosts} />
        <StatsCard label="Drafts" value={draftPosts} />
        <StatsCard label="Published" value={publishedPosts} />
      </div>
    </section>
  );
}
