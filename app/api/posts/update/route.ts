import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function POST(request: Request) {
  const adminCheck = await requireAdminApi();
  if (!adminCheck.ok) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  const body = await request.json();
  const {
    id,
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    metaTitle,
    metaDescription,
    status,
    publishedAt,
    categoryId,
    categoryName,
    tagIds,
    tagNames,
  } = body ?? {};

  if (!id) {
    return NextResponse.json({ error: "Missing post id." }, { status: 400 });
  }

  let resolvedCategoryId = categoryId;
  if (!resolvedCategoryId && categoryName) {
    const categorySlug = slugify(categoryName);
    if (!categorySlug) {
      return NextResponse.json(
        { error: "Invalid category name." },
        { status: 400 }
      );
    }
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName },
      create: { name: categoryName, slug: categorySlug },
    });
    resolvedCategoryId = category.id;
  }

  const resolvedSlug = slug ? slugify(slug) : undefined;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug: resolvedSlug,
      content,
      excerpt,
      featuredImage,
      metaTitle,
      metaDescription,
      status,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      categoryId: resolvedCategoryId,
    },
  });

  const normalizedTagNames = Array.isArray(tagNames)
    ? tagNames
    : typeof tagNames === "string"
      ? tagNames.split(",").map((tag: string) => tag.trim())
      : [];
  const tagNameIds = await Promise.all(
    normalizedTagNames
      .filter(Boolean)
      .map(async (name: string) => {
        const tagSlug = slugify(name);
        if (!tagSlug) {
          return null;
        }
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: { name },
          create: { name, slug: tagSlug },
        });
        return tag.id;
      })
  );
  const resolvedTagIds = [
    ...new Set([
      ...(Array.isArray(tagIds) ? tagIds : []),
      ...tagNameIds.filter(Boolean),
    ]),
  ] as string[];

  if (Array.isArray(tagIds) || normalizedTagNames.length) {
    await prisma.postTag.deleteMany({ where: { postId: id } });
    if (resolvedTagIds.length) {
      await prisma.postTag.createMany({
        data: resolvedTagIds.map((tagId) => ({ postId: id, tagId })),
      });
    }
  }

  return NextResponse.json({ post });
}
