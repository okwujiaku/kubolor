import { prisma } from "@/lib/prisma";
import { PostEditorShell } from "@/components/admin/PostEditorShell";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-horizon text-xl font-semibold text-white">
          Create new post
        </h2>
        <p className="text-sm text-slate-300">
          Draft a new article and save it as a draft or publish immediately.
        </p>
      </header>
      <PostEditorShell mode="create" categories={categories} tags={tags} />
    </section>
  );
}
