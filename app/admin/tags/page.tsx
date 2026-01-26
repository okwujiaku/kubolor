import { prisma } from "@/lib/prisma";
import { TagManager } from "@/components/admin/TagManager";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-horizon text-xl font-semibold text-white">Tags</h2>
        <p className="text-sm text-slate-300">
          Group content with flexible keyword tags.
        </p>
      </header>
      <TagManager
        tags={tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          postCount: tag._count.posts,
        }))}
      />
    </section>
  );
}
