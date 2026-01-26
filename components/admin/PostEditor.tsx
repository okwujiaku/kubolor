"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
                Featured Image URL
              </label>
              <input
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                value={featuredImage}
                onChange={(event) => setFeaturedImage(event.target.value)}
                placeholder="https://..."
              />
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
            <textarea
              className="min-h-[280px] w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              value={content}
              onChange={(event) => setContent(event.target.value)}
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
\"use client\";

import { useMemo, useState } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

type TagOption = {
  id: string;
  name: string;
};

type PostEditorData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  categoryId: string;
  tagIds: string[];
  publishedAt: string;
};

type PostEditorProps = {
  mode: "create" | "edit";
  categories: CategoryOption[];
  tags: TagOption[];
  initialData?: Partial<PostEditorData>;
  onSuccess?: (id: string) => void;
};

const emptyData: PostEditorData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  metaTitle: "",
  metaDescription: "",
  categoryId: "",
  tagIds: [],
  publishedAt: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, "")
    .replace(/\\s+/g, "-")
    .replace(/-+/g, "-");
}

export function PostEditor({
  mode,
  categories,
  tags,
  initialData,
  onSuccess,
}: PostEditorProps) {
  const [form, setForm] = useState<PostEditorData>({
    ...emptyData,
    ...initialData,
    tagIds: initialData?.tagIds ?? [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canPublish = useMemo(
    () => form.title && form.slug && form.content && form.categoryId,
    [form.title, form.slug, form.content, form.categoryId]
  );

  const tagLookup = useMemo(
    () => new Set(form.tagIds),
    [form.tagIds]
  );

  function updateField<K extends keyof PostEditorData>(
    key: K,
    value: PostEditorData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitPost(status: "draft" | "published") {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!form.categoryId) {
      setError("Select a category before saving.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      id: form.id,
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      featuredImage: form.featuredImage.trim() || null,
      metaTitle: form.metaTitle.trim() || null,
      metaDescription: form.metaDescription.trim() || null,
      status,
      publishedAt:
        status === "published"
          ? form.publishedAt || new Date().toISOString()
          : null,
      categoryId: form.categoryId,
      tagIds: form.tagIds,
    };

    try {
      const endpoint =
        mode === "edit" ? "/api/posts/update" : "/api/posts/create";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save post.");
      }

      const result = (await response.json()) as { post?: { id?: string } };
      const postId = result.post?.id ?? form.id ?? "";
      setSuccess(status === "published" ? "Post published!" : "Draft saved.");
      if (postId && onSuccess) {
        onSuccess(postId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300">Title</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  onBlur={() => {
                    if (!form.slug && form.title) {
                      updateField("slug", slugify(form.title));
                    }
                  }}
                  placeholder="Article title"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Slug</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.slug}
                  onChange={(event) =>
                    updateField("slug", slugify(event.target.value))
                  }
                  placeholder="ai-publishing-guide"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Excerpt</label>
                <textarea
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.excerpt}
                  onChange={(event) =>
                    updateField("excerpt", event.target.value)
                  }
                  placeholder="Short summary for previews."
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Content</label>
                <textarea
                  rows={14}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.content}
                  onChange={(event) =>
                    updateField("content", event.target.value)
                  }
                  placeholder="Write your article content here."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white">SEO settings</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-slate-300">Meta title</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.metaTitle}
                  onChange={(event) =>
                    updateField("metaTitle", event.target.value)
                  }
                  placeholder="Meta title for search engines"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">
                  Meta description
                </label>
                <textarea
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.metaDescription}
                  onChange={(event) =>
                    updateField("metaDescription", event.target.value)
                  }
                  placeholder="Short meta description"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Featured image</label>
                <input
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.featuredImage}
                  onChange={(event) =>
                    updateField("featuredImage", event.target.value)
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white">Publish</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>
                Status:{" "}
                <span className="font-semibold text-white">
                  {mode === "edit" && form.publishedAt
                    ? "Published"
                    : "Draft"}
                </span>
              </p>
              <div>
                <label className="text-sm text-slate-300">Publish date</label>
                <input
                  type="datetime-local"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={form.publishedAt}
                  onChange={(event) =>
                    updateField("publishedAt", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => submitPost("draft")}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save draft"}
              </button>
              <button
                type="button"
                onClick={() => submitPost("published")}
                disabled={isSubmitting || !canPublish}
                className="rounded-lg bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Publishing..." : "Publish now"}
              </button>
            </div>
            {error ? (
              <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                {success}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white">Category</h3>
            <select
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={form.categoryId}
              onChange={(event) =>
                updateField("categoryId", event.target.value)
              }
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-base font-semibold text-white">Tags</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.length ? (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      const next = new Set(form.tagIds);
                      if (next.has(tag.id)) {
                        next.delete(tag.id);
                      } else {
                        next.add(tag.id);
                      }
                      updateField("tagIds", Array.from(next));
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      tagLookup.has(tag.id)
                        ? "border-blue-400/60 bg-blue-500/20 text-blue-200"
                        : "border-slate-700 text-slate-300 hover:text-blue-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-slate-400">No tags yet.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
