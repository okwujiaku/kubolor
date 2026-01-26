import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/auth";
import { clerkClient } from "@clerk/nextjs/server";
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
    categoryName,
    tagIds = [],
    tagNames = [],
  } = body ?? {};

  if (!title || !content || (!categoryId && !categoryName)) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const resolvedSlug = slugify(slug ?? title);
  if (!resolvedSlug) {
    return NextResponse.json(
      { error: "Unable to generate slug." },
      { status: 400 }
    );
  }

  const resolvedAuthorId = authorId ?? adminCheck.userId;
  if (!resolvedAuthorId) {
    return NextResponse.json(
      { error: "Missing author." },
      { status: 400 }
    );
  }

  const clerkUser = await clerkClient.users.getUser(resolvedAuthorId);
  const email =
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    clerkUser.primaryEmailAddress?.emailAddress ??
    "unknown@kubolor.local";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  const authorRecord =
    existingUser ??
    (await prisma.user.create({
      data: {
        id: resolvedAuthorId,
        email,
        password: "clerk",
        role: "admin",
      },
    }));

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

  if (!resolvedCategoryId) {
    return NextResponse.json(
      { error: "Missing category." },
      { status: 400 }
    );
  }

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

  const post = await prisma.post.create({
    data: {
      title,
      slug: resolvedSlug,
      content,
      excerpt,
      featuredImage,
      metaTitle,
      metaDescription,
      status,
      publishedAt:
        status === "published"
          ? publishedAt
            ? new Date(publishedAt)
            : new Date()
          : publishedAt
            ? new Date(publishedAt)
            : undefined,
      authorId: authorRecord.id,
      categoryId: resolvedCategoryId,
      tags: resolvedTagIds.length
        ? {
            create: resolvedTagIds.map((tagId) => ({
              tagId,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json({ post });
}
