import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildPostMetadata } from "@/lib/seo";
import { AffiliateBlock } from "@/components/blog/AffiliateBlock";
import { AdSlot } from "@/components/blog/AdSlot";
import { CTABlock } from "@/components/blog/CTABlock";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
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
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return {
      title: "Kubolor",
      description: "AI-powered SEO blogging platform",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: true,
      tags: { include: { tag: true } },
    },
  }).catch((error) => {
    console.error("Post fetch failed:", error);
    return null;
  });

  if (!post) {
    return (
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16 text-slate-200">
        <h1 className="font-horizon text-3xl text-white">Post unavailable</h1>
        <p className="text-slate-300">
          We could not load this article right now. Please try again later.
        </p>
        <Link href="/blog" className="text-blue-300 hover:text-blue-200">
          Back to blog
        </Link>
      </main>
    );
  }

  const relatedPosts = await prisma.post
    .findMany({
      where: {
        status: "published",
        categoryId: post.categoryId,
        NOT: { id: post.id },
      },
      take: 3,
      orderBy: { publishedAt: "desc" },
    })
    .catch((error) => {
      console.error("Related posts fetch failed:", error);
      return [];
    });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16 text-slate-200">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-200">
          {post.category?.name ?? "Uncategorized"}
        </p>
        <h1 className="font-horizon text-4xl font-semibold tracking-tight text-white">
          {post.title}
        </h1>
        <p className="text-base text-slate-300">
          {post.excerpt ?? "No excerpt provided yet."}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span>By {post.author?.email ?? "Unknown author"}</span>
          {post.publishedAt ? (
            <span>{post.publishedAt.toDateString()}</span>
          ) : null}
        </div>
      </header>

      <article className="prose prose-invert max-w-none whitespace-pre-wrap">
        {post.content}
      </article>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <AdSlot />
      </div>

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
        <h2 className="font-horizon text-2xl font-semibold text-white">
          Related posts
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedPosts.map((related) => (
            <div
              key={related.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <Link
                href={`/blog/${related.slug}`}
                className="text-sm font-semibold text-white hover:text-blue-300"
              >
                {related.title}
              </Link>
              <p className="mt-2 text-xs text-slate-400">
                {related.excerpt ?? "No excerpt available."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
