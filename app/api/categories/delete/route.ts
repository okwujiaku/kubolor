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
  const { id } = body ?? {};

  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const inUse = await prisma.post.count({ where: { categoryId: id } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "Category has posts. Reassign or delete posts first." },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
