import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/PostCard";

export const dynamic = "force-dynamic";

type BlogListingPageProps = {
  searchParams?: {
    page?: string;
    category?: string;
  };
};

const PAGE_SIZE = 9;

export default async function BlogListingPage({
  searchParams,
}: BlogListingPageProps) {
  const page = Math.max(Number(searchParams?.page ?? "1"), 1);
  const categorySlug = searchParams?.category;

  let posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: { name: string } | null;
  }> = [];
  let total = 0;
  let categories: Array<{ id: string; name: string; slug: string }> = [];

  try {
    [posts, total, categories] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: "published",
          category: categorySlug ? { slug: categorySlug } : undefined,
        },
        orderBy: { publishedAt: "desc" },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        include: { category: true },
      }),
      prisma.post.count({
        where: {
          status: "published",
          category: categorySlug ? { slug: categorySlug } : undefined,
        },
      }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (error) {
    console.error("Blog listing fetch failed:", error);
  }

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-200">
          Blog
        </p>
        <h1 className="font-horizon text-4xl font-semibold tracking-tight text-white">
          Latest SEO insights
        </h1>
        <p className="text-base text-slate-300">
          Browse published articles and filter by category.
        </p>
      </header>

      <section className="flex flex-wrap gap-3">
        <Link
          href="/blog"
          className={`rounded-full border px-4 py-1 text-sm transition ${
            !categorySlug
              ? "border-blue-400/50 bg-blue-500/20 text-blue-200"
              : "border-slate-700 text-slate-300 hover:text-blue-200"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?category=${category.slug}`}
            className={`rounded-full border px-4 py-1 text-sm transition ${
              categorySlug === category.slug
                ? "border-blue-400/50 bg-blue-500/20 text-blue-200"
                : "border-slate-700 text-slate-300 hover:text-blue-200"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              category={post.category?.name}
            />
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center text-sm text-slate-300">
            No posts found yet.
          </div>
        )}
      </section>

      <footer className="flex items-center justify-between text-sm text-slate-400">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-4">
          {page > 1 ? (
            <Link href={`/blog?page=${page - 1}`} className="hover:text-blue-200">
              Previous
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link href={`/blog?page=${page + 1}`} className="hover:text-blue-200">
              Next
            </Link>
          ) : null}
        </div>
      </footer>
    </main>
  );
}
