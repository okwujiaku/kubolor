import "server-only";

type GenerateSEOArticleInput = {
  topic: string;
  keywords: string[];
  tone: "professional" | "casual" | "persuasive";
  length: "short" | "medium" | "long";
};

type SEOArticleResult = {
  content: string;
  metaTitle: string;
  metaDescription: string;
};

const LENGTH_TO_WORDS: Record<GenerateSEOArticleInput["length"], string> = {
  short: "600-800 words",
  medium: "1200-1500 words",
  long: "1800-2200 words",
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function generateSEOArticle(
  input: GenerateSEOArticleInput
): Promise<SEOArticleResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const keywords = input.keywords.join(", ");

  const systemPrompt =
    "You are an expert SEO copywriter. Return JSON only with fields: metaTitle, metaDescription, markdown.";
  const userPrompt = [
    `Topic: ${input.topic}`,
    `Primary keywords: ${keywords}`,
    `Tone: ${input.tone}`,
    `Length: ${LENGTH_TO_WORDS[input.length]}`,
    "",
    "Write a full article in Markdown with:",
    "- One H1 title",
    "- Multiple H2/H3 sections",
    "- A dedicated FAQ section",
    "- Internal linking suggestions section",
    "- A meta title and meta description that are SEO optimized",
    "",
    "Return only JSON.",
  ].join("\n");

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content ?? "";

  const parsed = safeJsonParse(content);
  if (!parsed) {
    return {
      content,
      metaTitle: input.topic,
      metaDescription: `Read our guide on ${input.topic}.`,
    };
  }

  return {
    content: parsed.markdown ?? content,
    metaTitle: parsed.metaTitle ?? input.topic,
    metaDescription:
      parsed.metaDescription ?? `Read our guide on ${input.topic}.`,
  };
}

function safeJsonParse(
  content: string
): { metaTitle?: string; metaDescription?: string; markdown?: string } | null {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}
