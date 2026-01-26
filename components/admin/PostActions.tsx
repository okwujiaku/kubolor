"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PostActionsProps = {
  postId: string;
  status: string;
};

export function PostActions({ postId, status }: PostActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handlePublish() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });

      if (!response.ok) {
        throw new Error("Publish failed.");
      }

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 text-xs font-semibold">
      <a
        href={`/admin/posts/${postId}`}
        className="text-blue-200 hover:text-blue-100"
      >
        Edit
      </a>
      {status !== "published" ? (
        <button
          className="rounded-full border border-emerald-500/40 px-3 py-1 text-emerald-200 transition hover:border-emerald-400 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handlePublish}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "Publishing..." : "Publish"}
        </button>
      ) : null}
    </div>
  );
}
