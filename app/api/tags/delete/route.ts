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

  const inUse = await prisma.postTag.count({ where: { tagId: id } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "Tag is used by posts. Remove it from posts first." },
      { status: 400 }
    );
  }

  await prisma.tag.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
