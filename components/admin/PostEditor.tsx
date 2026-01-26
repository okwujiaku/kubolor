"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type TagOption = {
  id: string;
  name: string;
};

type PostEditorInitial = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  featuredImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status?: string;
  categoryId?: string | null;
  tagIds?: string[];
  publishedAt?: string | null;
};

type PostEditorProps = {
  mode: "create" | "edit";
  categories: CategoryOption[];
  tags?: TagOption[];
  initialData?: PostEditorInitial;
  onSuccess?: (id?: string) => void;
};

export function PostEditor({
  mode,
  categories,
  tags = [],
  initialData,
  onSuccess,
}: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage ?? ""
  );
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? categories[0]?.id ?? ""
  );
  const [newCategory, setNewCategory] = useState("");
  const initialTagNames = useMemo(() => {
    if (!initialData?.tagIds?.length) {
      return "";
    }
    const map = new Map(tags.map((tag) => [tag.id, tag.name]));
    return initialData.tagIds
      .map((id) => map.get(id))
      .filter(Boolean)
      .join(", ");
  }, [initialData?.tagIds, tags]);
  const [tagNames, setTagNames] = useState(initialTagNames);
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewSlug = useMemo(
    () => slugify(slug || title),
    [slug, title]
  );

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setFeaturedImage(result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(action: "draft" | "publish") {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        id: initialData?.id,
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        featuredImage: featuredImage.trim() || undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        status: action === "publish" ? "published" : "draft",
        publishedAt:
          action === "publish"
            ? publishedAt || new Date().toISOString()
            : publishedAt || undefined,
        categoryId: newCategory.trim() ? undefined : categoryId || undefined,
        categoryName: newCategory.trim() || undefined,
        tagNames: tagNames,
      };

      const endpoint =
        mode === "create" ? "/api/posts/create" : "/api/posts/update";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Save failed.");
      }

      const data = await response.json();
      const postId = data?.post?.id ?? initialData?.id;

      router.refresh();
      if (onSuccess) {
        onSuccess(postId);
      } else if (postId) {
        router.push(`/admin/posts/${postId}`);
      } else {
        router.push("/admin/posts");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Title
            </label>
            <input
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Write a strong, search-friendly title"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Slug
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="auto-generated from title"
              />
              <p className="text-xs text-slate-500">
                Preview: /blog/{previewSlug || "your-slug"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Featured Image
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={featuredImage}
                onChange={(event) => setFeaturedImage(event.target.value)}
                placeholder="Paste image URL"
              />
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-300"
                onChange={(event) =>
                  handleImageUpload(event.target.files?.[0] ?? null)
                }
              />
              {featuredImage ? (
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/50">
                  <img
                    src={featuredImage}
                    alt="Featured preview"
                    className="h-40 w-full object-cover"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Excerpt
            </label>
            <textarea
              className="min-h-[90px] w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Short summary shown on cards and previews"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Content (Markdown)
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write or paste your article in Markdown..."
            />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Category
              </label>
              <select
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                disabled={!!newCategory.trim()}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Or create new category"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Tags
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={tagNames}
                onChange={(event) => setTagNames(event.target.value)}
                placeholder="seo, marketing, ai"
              />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Publish Date
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                type="datetime-local"
                value={publishedAt}
                onChange={(event) => setPublishedAt(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Meta Title
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                placeholder="SEO meta title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Meta Description
              </label>
              <textarea
                className="min-h-[100px] w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                placeholder="SEO meta description"
              />
            </div>
          </section>

          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <button
              className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => handleSubmit("draft")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save draft"}
            </button>
            <button
              className="rounded-xl border border-blue-400/60 px-4 py-3 text-sm font-semibold text-blue-100 transition hover:border-blue-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => handleSubmit("publish")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish now"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
