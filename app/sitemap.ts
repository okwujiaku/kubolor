import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
  });

  const baseUrl = getSiteUrl();
  const postEntries = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...postEntries,
  ];
}
