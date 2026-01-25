import Link from "next/link";
import { prisma } from "@/lib/prisma";

type AdminEditPostPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminEditPostPage({
  params,
}: AdminEditPostPageProps) {
  const post = await prisma.post
    .findUnique({
      where: { id: params.id },
      include: { category: true, tags: { include: { tag: true } } },
    })
    .catch((error) => {
      console.error("Admin edit post fetch failed:", error);
      return null;
    });

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
      <header>
        <h2 className="font-horizon text-xl font-semibold text-white">
          Edit post
        </h2>
        <p className="text-sm text-slate-300">
          Update your content, adjust metadata, and publish when ready.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-sm text-slate-300">
        Editing <strong>{post.title}</strong>. Form UI will be connected to
        `/api/posts/update` and `/api/posts/publish`.
      </div>
    </section>
  );
}
