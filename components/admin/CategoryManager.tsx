"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";

type Category = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

type CategoryManagerProps = {
  categories: Category[];
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nextSlug = useMemo(
    () => slugify(newSlug || newName),
    [newSlug, newName]
  );

  async function handleCreate() {
    if (!newName.trim()) {
      setError("Category name is required.");
      return;
    }
    setError(null);
    setPendingId("create");

    try {
      const response = await fetch("/api/categories/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug: newSlug.trim() }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create category.");
      }
      setNewName("");
      setNewSlug("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleUpdate(id: string, name: string, slug: string) {
    setError(null);
    setPendingId(id);
    try {
      const response = await fetch("/api/categories/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, slug }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update category.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setPendingId(id);
    try {
      const response = await fetch("/api/categories/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete category.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <h3 className="text-base font-semibold text-white">Add category</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Category name"
          />
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            value={newSlug}
            onChange={(event) => setNewSlug(event.target.value)}
            placeholder="Slug (optional)"
          />
          <button
            className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleCreate}
            disabled={pendingId === "create"}
          >
            {pendingId === "create" ? "Creating..." : "Create"}
          </button>
        </div>
        {nextSlug && (
          <p className="mt-2 text-xs text-slate-500">Slug preview: {nextSlug}</p>
        )}
      </section>

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/70 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Posts</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length ? (
              categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  pendingId={pendingId}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-sm text-slate-400"
                >
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

type CategoryRowProps = {
  category: Category;
  onUpdate: (id: string, name: string, slug: string) => void;
  onDelete: (id: string) => void;
  pendingId: string | null;
};

function CategoryRow({
  category,
  onUpdate,
  onDelete,
  pendingId,
}: CategoryRowProps) {
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);

  return (
    <tr className="border-t border-slate-800">
      <td className="px-4 py-3">
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-white"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-white"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
      </td>
      <td className="px-4 py-3 text-slate-300">{category.postCount}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-full border border-blue-400/40 px-3 py-1 text-xs text-blue-200 transition hover:border-blue-300 hover:text-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pendingId === category.id}
            onClick={() => onUpdate(category.id, name.trim(), slug.trim())}
          >
            {pendingId === category.id ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-200 transition hover:border-red-300 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pendingId === category.id}
            onClick={() => onDelete(category.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
