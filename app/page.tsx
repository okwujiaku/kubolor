import Link from "next/link";
import type { Metadata } from "next";
import type { Category, Post } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";
import { getSiteUrl } from "@/lib/site";
import { getAdminStatus } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI-powered publishing built for growth",
  description:
    "Kubolor helps you plan, generate, and publish SEO-driven articles with a clean editorial workflow and ready-to-scale infrastructure.",
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    title: "AI-powered publishing built for growth",
    description:
      "Kubolor helps you plan, generate, and publish SEO-driven articles with a clean editorial workflow and ready-to-scale infrastructure.",
    url: getSiteUrl(),
    type: "website",
    images: [
      {
        url: "/kubolor-logo.png",
        width: 1200,
        height: 630,
        alt: "Kubolor logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-powered publishing built for growth",
    description:
      "Kubolor helps you plan, generate, and publish SEO-driven articles with a clean editorial workflow and ready-to-scale infrastructure.",
    images: ["/kubolor-logo.png"],
  },
};

export default async function HomePage() {
  let latestPosts: Array<Post & { category: Category | null }> = [];
  let categories: Category[] = [];
  let isAdmin = false;

  try {
    const results = await Promise.all([
      prisma.post.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 6,
        include: { category: true },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
      getAdminStatus(),
    ]);
    [latestPosts, categories] = results;
    isAdmin = results[2].isAdmin;
  } catch (error) {
    console.error("Homepage data fetch failed:", error);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white/80 text-slate-900 shadow-[0_35px_80px_-50px_rgba(15,23,42,0.35)]">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-6 top-6 h-2 w-2 rounded-full bg-rose-200" />
          <div className="absolute right-12 top-10 h-2 w-2 rounded-full bg-blue-200" />
          <div className="absolute bottom-8 left-24 h-1.5 w-1.5 rounded-full bg-emerald-200" />
          <div className="absolute bottom-10 right-24 h-1.5 w-1.5 rounded-full bg-amber-200" />
        </div>
        <div className="relative grid gap-12 px-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-blue-100/80 bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              The new standard in SEO blogging
            </p>
            <h1 className="font-horizon text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              AI-powered publishing built for
              <span className="text-blue-600"> growth</span>.
            </h1>
            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              Kubolor helps you plan, generate, and publish SEO-driven articles
              with a clean editorial workflow and ready-to-scale infrastructure.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/blog"
                className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Explore Articles
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  Admin Dashboard
                </Link>
              ) : null}
            </div>
          </div>

          <div className="relative flex items-end justify-center">
            <div className="relative">
              <div className="absolute -left-10 top-4 rounded-3xl border-2 border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800 shadow-[0_20px_40px_-25px_rgba(15,23,42,0.45)]">
                <span className="block text-blue-600">Kubolor says</span>
                <span className="block max-w-[180px] text-sm font-medium text-slate-700">
                  Publish smarter, rank faster.
                </span>
                <div className="absolute -bottom-3 left-6 h-4 w-4 rounded-full border-2 border-slate-200 bg-white" />
                <div className="absolute -bottom-6 left-3 h-2.5 w-2.5 rounded-full border-2 border-slate-200 bg-white" />
              </div>
              <div className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-2xl">
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
        <div className="flex items-end justify-between border-b border-rose-100 pb-4">
          <div>
            <h2 className="font-horizon text-3xl font-bold text-slate-900">
              Latest Posts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fresh content from our editorial team
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
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
            <div className="col-span-full rounded-2xl border border-dashed border-rose-200 bg-white/70 p-16 text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-blue-50 p-4">
                <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="font-medium text-slate-800">No published posts yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Create one in the{" "}
                <Link href="/admin" className="font-medium text-blue-600 hover:text-blue-500">
                  admin dashboard
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-rose-100 pb-4">
          <div>
            <h2 className="font-horizon text-3xl font-bold text-slate-900">
              Categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
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
                className="group rounded-xl border border-rose-100 bg-white/80 px-6 py-8 text-center font-medium shadow-lg shadow-rose-100/40 transition hover:border-blue-200 hover:bg-white"
              >
                <span className="text-slate-700 transition-colors group-hover:text-blue-600">
                  {category.name}
                </span>
              </Link>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-rose-200 bg-white/70 p-12 text-center">
              <p className="text-sm text-slate-500">
                No categories yet. Create them in the database.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
