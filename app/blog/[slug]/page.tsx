import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildPostMetadata } from "@/lib/seo";
import { AffiliateBlock } from "@/components/blog/AffiliateBlock";
import { AdSlot } from "@/components/blog/AdSlot";
import { CTABlock } from "@/components/blog/CTABlock";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      excerpt: true,
      metaTitle: true,
      metaDescription: true,
      featuredImage: true,
    },
  });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return buildPostMetadata({
    title: post.title,
    excerpt: post.excerpt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    featuredImage: post.featuredImage,
    slug: params.slug,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    notFound();
  }

  const relatedPosts = await prisma.post.findMany({
    where: {
      status: "published",
      categoryId: post.categoryId,
      NOT: { id: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {post.category?.name ?? "Uncategorized"}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
        <p className="text-base text-muted-foreground">
          {post.excerpt ?? "No excerpt provided yet."}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>By {post.author?.email ?? "Unknown author"}</span>
          {post.publishedAt ? (
            <span>{post.publishedAt.toDateString()}</span>
          ) : null}
        </div>
      </header>

      <article className="prose prose-neutral max-w-none whitespace-pre-wrap">
        {post.content}
      </article>

      <AdSlot />

      <CTABlock
        title="Ready to scale your content?"
        description="Start producing structured, search-optimized articles with Kubolor."
        ctaLabel="Get started"
        ctaHref="/admin"
      />

      <AffiliateBlock
        toolName="SEO Toolkit"
        description="Track rankings, keywords, and content performance."
        url="https://example.com"
      />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Related posts</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedPosts.map((related) => (
            <div key={related.id} className="rounded-2xl border bg-card p-4">
              <a
                href={`/blog/${related.slug}`}
                className="text-sm font-semibold hover:underline"
              >
                {related.title}
              </a>
              <p className="mt-2 text-xs text-muted-foreground">
                {related.excerpt ?? "No excerpt available."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
