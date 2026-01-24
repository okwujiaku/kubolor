import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";

export default async function HomePage() {
  const [latestPosts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
      <section className="rounded-3xl border bg-card p-10">
        <div className="max-w-2xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Kubolor
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            AI-powered blogging for scalable SEO growth
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Publish optimized, structured content with full control over your
            editorial workflow.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest posts</h2>
          <span className="text-sm text-muted-foreground">
            Showing the most recent 6 posts
          </span>
        </header>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestPosts.length ? (
            latestPosts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                category={post.category?.name}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              No published posts yet. Create one in the admin dashboard.
            </div>
          )}
        </div>
        <Link
          href="/blog"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all posts
        </Link>
      </section>

      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <span className="text-sm text-muted-foreground">
            Browse by topic
          </span>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length ? (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="rounded-2xl border bg-card px-6 py-8 text-base font-medium"
              >
                {category.name}
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
              No categories yet. Create them in the database.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
