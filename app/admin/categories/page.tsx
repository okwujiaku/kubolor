import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-horizon text-xl font-semibold text-white">
          Categories
        </h2>
        <p className="text-sm text-slate-300">
          Organize your topics and keep the blog structured.
        </p>
      </header>
      <CategoryManager
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          postCount: category._count.posts,
        }))}
      />
    </section>
  );
}
