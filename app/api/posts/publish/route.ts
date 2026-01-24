import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, publishedAt } = body ?? {};

  if (!id) {
    return NextResponse.json({ error: "Missing post id." }, { status: 400 });
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      status: "published",
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    },
  });

  return NextResponse.json({ post });
}
