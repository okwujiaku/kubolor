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

  const [posts, total, categories] = await Promise.all([
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

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Blog
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Latest SEO insights
        </h1>
        <p className="text-base text-muted-foreground">
          Browse published articles and filter by category.
        </p>
      </header>

      <section className="flex flex-wrap gap-3">
        <Link
          href="/blog"
          className={`rounded-full border px-4 py-1 text-sm ${
            !categorySlug ? "bg-card" : "text-muted-foreground"
          }`}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blog?category=${category.slug}`}
            className={`rounded-full border px-4 py-1 text-sm ${
              categorySlug === category.slug
                ? "bg-card"
                : "text-muted-foreground"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            category={post.category?.name}
          />
        ))}
      </section>

      <footer className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-4">
          {page > 1 ? (
            <Link href={`/blog?page=${page - 1}`}>Previous</Link>
          ) : null}
          {page < totalPages ? (
            <Link href={`/blog?page=${page + 1}`}>Next</Link>
          ) : null}
        </div>
      </footer>
    </main>
  );
}
