import { prisma } from "@/lib/prisma";
import { AiPostBuilder } from "@/components/admin/AiPostBuilder";

export const dynamic = "force-dynamic";

export default async function AdminAIGeneratorPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <AiPostBuilder categories={categories} tags={tags} />;
}
