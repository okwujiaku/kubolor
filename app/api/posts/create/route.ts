import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    metaTitle,
    metaDescription,
    status = "draft",
    publishedAt,
    authorId,
    categoryId,
    tagIds = [],
  } = body ?? {};

  if (!title || !slug || !content || !authorId || !categoryId) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      metaTitle,
      metaDescription,
      status,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      authorId,
      categoryId,
      tags: Array.isArray(tagIds)
        ? {
            create: tagIds.map((tagId: string) => ({
              tagId,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json({ post });
}
