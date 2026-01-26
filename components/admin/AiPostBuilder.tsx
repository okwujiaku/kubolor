"use client";

import { useMemo, useState } from "react";
import { PostEditor } from "@/components/admin/PostEditor";
import { slugify } from "@/lib/slug";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type TagOption = {
  id: string;
  name: string;
};

type AiPostBuilderProps = {
  categories: CategoryOption[];
  tags: TagOption[];
};

type AiResult = {
  content: string;
  metaTitle: string;
  metaDescription: string;
};

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
] as const;

const LENGTH_OPTIONS = [
  { value: "short", label: "Short (600-800 words)" },
  { value: "medium", label: "Medium (1200-1500 words)" },
  { value: "long", label: "Long (1800-2200 words)" },
] as const;

function buildExcerpt(content: string, maxLength = 160) {
  const text = content.replace(/[#>*_`]/g, "").replace(/\\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export function AiPostBuilder({ categories, tags }: AiPostBuilderProps) {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState<(typeof TONE_OPTIONS)[number]["value"]>(
    "professional"
  );
  const [length, setLength] = useState<
    (typeof LENGTH_OPTIONS)[number]["value"]
  >("medium");
  const [result, setResult] = useState<AiResult | null>(null);
  const [editorSeed, setEditorSeed] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorInitialData = useMemo(() => {
    if (!result) return undefined;
    const title = result.metaTitle || topic || "Untitled draft";
    const excerpt =
      result.metaDescription || buildExcerpt(result.content ?? "");
    return {
      title,
      slug: slugify(title || topic || "draft"),
      excerpt,
      content: result.content ?? "",
      featuredImage: "",
      metaTitle: result.metaTitle ?? "",
      metaDescription: result.metaDescription ?? "",
      categoryId: "",
      tagIds: [],
      publishedAt: "",
    };
  }, [result, topic]);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          keywords: keywords
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          tone,
          length,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "AI generation failed.");
      }

      const data = (await response.json()) as AiResult;
      setResult(data);
      setEditorSeed((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="font-horizon text-xl font-semibold text-white">
            AI article generator
          </h2>
          <p className="text-sm text-slate-300">
            Generate a draft with OpenAI, then refine and publish it.
          </p>
        </div>
        <div className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs text-slate-400">
          Connected to `/api/ai/generate`
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white">
              Generate a draft
            </h3>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="text-slate-300">Topic</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="AI-powered SEO for creators"
                />
              </div>
              <div>
                <label className="text-slate-300">Keywords</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={keywords}
                  onChange={(event) => setKeywords(event.target.value)}
                  placeholder="seo tools, content strategy, ai writing"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-slate-300">Tone</label>
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={tone}
                    onChange={(event) =>
                      setTone(
                        event.target.value as (typeof TONE_OPTIONS)[number]["value"]
                      )
                    }
                  >
                    {TONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300">Length</label>
                  <select
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={length}
                    onChange={(event) =>
                      setLength(
                        event.target.value as (typeof LENGTH_OPTIONS)[number]["value"]
                      )
                    }
                  >
                    {LENGTH_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className="w-full rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Generating..." : "Generate draft"}
              </button>
              {error ? (
                <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white">
              Generated preview
            </h3>
            {result ? (
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Meta title
                  </p>
                  <p className="mt-1 text-white">{result.metaTitle}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Meta description
                  </p>
                  <p className="mt-1">{result.metaDescription}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Content preview
                  </p>
                  <p className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-200">
                    {result.content}
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  Draft applied to the editor below. Add a category before
                  publishing.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">
                Generate a draft to see the preview.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white">Edit & publish</h3>
            <p className="mt-2 text-sm text-slate-300">
              Review the AI draft, customize SEO fields, then save or publish.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            {result ? (
              <PostEditor
                key={editorSeed}
                mode="create"
                categories={categories}
                tags={tags}
                initialData={editorInitialData}
              />
            ) : (
              <p className="text-sm text-slate-400">
                Generate a draft to unlock the editor.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
