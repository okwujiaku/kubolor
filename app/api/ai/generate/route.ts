import { NextResponse } from "next/server";
import { generateSEOArticle } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { topic, keywords, tone, length } = body ?? {};

  if (!topic || !keywords || !tone || !length) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const normalizedKeywords = Array.isArray(keywords)
    ? keywords
    : String(keywords)
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

  const result = await generateSEOArticle({
    topic,
    keywords: normalizedKeywords,
    tone,
    length,
  });

  await prisma.aIGenerationLog.create({
    data: {
      topic,
      keywords: normalizedKeywords.join(", "),
      tone,
      length,
      generatedContent: result.content,
    },
  });

  return NextResponse.json(result);
}
