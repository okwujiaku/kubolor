import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

type AdminEditPostPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminEditPostPage({
  params,
}: AdminEditPostPageProps) {
  const [post, categories, tags] = await Promise.all([
    prisma.post
      .findUnique({
        where: { id: params.id },
        include: { category: true, tags: { include: { tag: true } } },
      })
      .catch((error) => {
        console.error("Admin edit post fetch failed:", error);
        return null;
      }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) {
    return (
      <section className="space-y-4 text-slate-300">
        <h2 className="font-horizon text-xl text-white">Post unavailable</h2>
        <p>We could not load this post right now.</p>
        <Link href="/admin/posts" className="text-blue-300 hover:text-blue-200">
          Back to posts
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-horizon text-xl font-semibold text-white">
          Edit post
        </h2>
        <p className="text-sm text-slate-300">
          Update your content, adjust metadata, and publish when ready.
        </p>
      </header>
      <PostEditor
        mode="edit"
        categories={categories}
        tags={tags}
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          featuredImage: post.featuredImage ?? "",
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          categoryId: post.categoryId,
          tagIds: post.tags.map((tag) => tag.tagId),
          publishedAt: post.publishedAt
            ? post.publishedAt.toISOString().slice(0, 16)
            : "",
        }}
      />
    </section>
  );
}
