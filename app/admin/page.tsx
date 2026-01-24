import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";

export default async function AdminDashboardPage() {
  const [totalPosts, draftPosts, publishedPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.post.count({ where: { status: "published" } }),
  ]);

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">
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
