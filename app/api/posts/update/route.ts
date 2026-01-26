import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";

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
    tagIds,
  } = body ?? {};

  if (!id) {
    return NextResponse.json({ error: "Missing post id." }, { status: 400 });
  }

  const post = await prisma.post.update({
    where: { id },
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
      categoryId,
    },
  });

  if (Array.isArray(tagIds)) {
    await prisma.postTag.deleteMany({ where: { postId: id } });
    if (tagIds.length) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId: string) => ({ postId: id, tagId })),
      });
    }
  }

  return NextResponse.json({ post });
}
