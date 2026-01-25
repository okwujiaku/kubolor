import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";

export const dynamic = "force-dynamic";

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
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="inline-block rounded-full bg-blue-50 border border-blue-200 px-4 py-2">
          <p className="text-sm font-medium text-blue-600">
            AI-Powered Content Platform
          </p>
        </div>
        <h1 style={{ fontFamily: 'Horizon, sans-serif' }} className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          AI-powered blogging for<br />
          <span className="text-blue-600">scalable SEO growth</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
          Publish optimized, structured content with full control over your
          editorial workflow. Built for modern SEO and content marketing.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link 
            href="/blog" 
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Explore Articles
          </Link>
          <Link 
            href="/admin" 
            className="rounded-lg border-2 border-blue-600 px-8 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-all"
          >
            Admin Dashboard
          </Link>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b-2 border-blue-100 pb-4">
          <div>
            <h2 style={{ fontFamily: 'Horizon, sans-serif' }} className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <p className="mt-1 text-sm text-gray-600">Fresh content from our editorial team</p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-blue-600 hover:text-blue-700">
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
            <h2 style={{ fontFamily: 'Horizon, sans-serif' }} className="text-3xl font-bold text-gray-900">Categories</h2>
            <p className="mt-1 text-sm text-gray-600">Browse content by topic</p>
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
