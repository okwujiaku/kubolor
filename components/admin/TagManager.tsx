"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";

type Tag = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
};

type TagManagerProps = {
  tags: Tag[];
};

export function TagManager({ tags }: TagManagerProps) {
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
      setError("Tag name is required.");
      return;
    }
    setError(null);
    setPendingId("create");

    try {
      const response = await fetch("/api/tags/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), slug: newSlug.trim() }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create tag.");
      }
      setNewName("");
      setNewSlug("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tag.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleUpdate(id: string, name: string, slug: string) {
    setError(null);
    setPendingId(id);
    try {
      const response = await fetch("/api/tags/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name, slug }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update tag.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tag.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    setPendingId(id);
    try {
      const response = await fetch("/api/tags/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete tag.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tag.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
        <h3 className="text-base font-semibold text-white">Add tag</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <input
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Tag name"
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
            {tags.length ? (
              tags.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
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
                  No tags yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

type TagRowProps = {
  tag: Tag;
  onUpdate: (id: string, name: string, slug: string) => void;
  onDelete: (id: string) => void;
  pendingId: string | null;
};

function TagRow({ tag, onUpdate, onDelete, pendingId }: TagRowProps) {
  const [name, setName] = useState(tag.name);
  const [slug, setSlug] = useState(tag.slug);

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
      <td className="px-4 py-3 text-slate-300">{tag.postCount}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-full border border-blue-400/40 px-3 py-1 text-xs text-blue-200 transition hover:border-blue-300 hover:text-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pendingId === tag.id}
            onClick={() => onUpdate(tag.id, name.trim(), slug.trim())}
          >
            {pendingId === tag.id ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="rounded-full border border-red-400/40 px-3 py-1 text-xs text-red-200 transition hover:border-red-300 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pendingId === tag.id}
            onClick={() => onDelete(tag.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
