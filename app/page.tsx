import Link from "next/link";
import type { Category, Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let latestPosts: Array<Post & { category: Category | null }> = [];
  let categories: Category[] = [];

  try {
    [latestPosts, categories] = await Promise.all([
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
  } catch (error) {
    console.error("Homepage data fetch failed:", error);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.35),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(14,116,144,0.35),transparent_45%)]"
          aria-hidden="true"
        />
        <div className="relative grid gap-12 px-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
              The new standard in SEO blogging
            </p>
            <h1 className="font-horizon text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              AI-powered publishing built for
              <span className="text-blue-300"> growth</span>.
            </h1>
            <p className="max-w-xl text-base text-slate-200 sm:text-lg">
              Kubolor helps you plan, generate, and publish SEO-driven articles
              with a clean editorial workflow and ready-to-scale infrastructure.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/blog"
                className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400"
              >
                Explore Articles
              </Link>
              <Link
                href="/admin"
                className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>

          <div className="relative flex items-end justify-center">
            <div className="relative">
              <div className="absolute -left-6 top-6 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-slate-900 shadow-xl">
                <span className="block text-blue-600">Kubolor says</span>
                <span className="block max-w-[160px] text-sm font-medium text-slate-800">
                  Publish smarter, rank faster.
                </span>
              </div>
              <div className="absolute -left-2 top-16 h-4 w-4 rotate-45 bg-white" />
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800 shadow-2xl">
                <img
                  src="/profile.png"
                  alt="Kubolor founder"
                  className="h-[360px] w-[280px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b-2 border-blue-100 pb-4">
          <div>
            <h2 className="font-horizon text-3xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Fresh content from our editorial team
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
            <div className="col-span-full rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-16 text-center">
              <div className="mx-auto w-fit rounded-full bg-blue-100 p-4 mb-4">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">No published posts yet</p>
              <p className="mt-1 text-sm text-gray-600">
                Create one in the{" "}
                <Link href="/admin" className="font-medium text-blue-600 hover:text-blue-700">
                  admin dashboard
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b-2 border-blue-100 pb-4">
          <div>
            <h2 className="font-horizon text-3xl font-bold text-gray-900">
              Categories
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Browse content by topic
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length ? (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className="group rounded-xl border-2 border-blue-100 bg-white px-6 py-8 text-center font-medium hover:border-blue-600 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md"
              >
                <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-12 text-center">
              <p className="text-sm text-gray-600">
                No categories yet. Create them in the database.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
