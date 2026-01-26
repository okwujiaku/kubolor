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
  const { id, name, slug } = body ?? {};

  if (!id || !name) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const resolvedSlug = slugify(slug ?? name);
  if (!resolvedSlug) {
    return NextResponse.json({ error: "Invalid slug." }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug: resolvedSlug },
  });

  return NextResponse.json({ category });
}
