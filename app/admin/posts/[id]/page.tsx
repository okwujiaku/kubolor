import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type AdminEditPostPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminEditPostPage({
  params,
}: AdminEditPostPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!post) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Edit post</h2>
        <p className="text-sm text-muted-foreground">
          Update your content, adjust metadata, and publish when ready.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
        Editing <strong>{post.title}</strong>. Form UI will be connected to
        `/api/posts/update` and `/api/posts/publish`.
      </div>
    </section>
  );
}
