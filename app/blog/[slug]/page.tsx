import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { buildPostMetadata } from "@/lib/seo";
import { AffiliateBlock } from "@/components/blog/AffiliateBlock";
import { AdSlot } from "@/components/blog/AdSlot";
import { CTABlock } from "@/components/blog/CTABlock";
import { clerkClient } from "@clerk/nextjs/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-16 text-slate-700">
        <h1 className="font-horizon text-3xl text-slate-900">Post unavailable</h1>
        <p className="text-slate-600">
          We could not load this article right now. Please try again later.
        </p>
        <Link href="/blog" className="text-blue-600 hover:text-blue-500">
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

  let authorName = post.author?.email ?? "Unknown author";
  if (post.authorId) {
    try {
      const clerkUser = await clerkClient.users.getUser(post.authorId);
      const clerkName =
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        clerkUser.username ||
        clerkUser.primaryEmailAddress?.emailAddress;
      if (clerkName) {
        authorName = clerkName;
      }
    } catch (error) {
      console.error("Author lookup failed:", error);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16 text-slate-700">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
          {post.category?.name ?? "Uncategorized"}
        </p>
        <h1 className="font-horizon text-4xl font-semibold tracking-tight text-slate-900">
          {post.title}
        </h1>
        <p className="text-base text-slate-600">
          {post.excerpt ?? "No excerpt provided yet."}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>By {authorName}</span>
          {post.publishedAt ? (
            <span>{post.publishedAt.toDateString()}</span>
          ) : null}
        </div>
      </header>

      <article className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>

      <div className="rounded-2xl border border-rose-100 bg-white/70 p-4">
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
        <h2 className="font-horizon text-2xl font-semibold text-slate-900">
          Related posts
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {relatedPosts.map((related) => (
            <div
              key={related.id}
              className="rounded-2xl border border-rose-100 bg-white/70 p-4"
            >
              <Link
                href={`/blog/${related.slug}`}
                className="text-sm font-semibold text-slate-900 hover:text-blue-600"
              >
                {related.title}
              </Link>
              <p className="mt-2 text-xs text-slate-500">
                {related.excerpt ?? "No excerpt available."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
