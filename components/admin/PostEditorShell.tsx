"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";

type PostEditorShellProps = ComponentProps<typeof PostEditor>;

export function PostEditorShell(props: PostEditorShellProps) {
  const router = useRouter();

  return (
    <PostEditor
      {...props}
      onSuccess={(id) => {
        if (id) {
          router.push(`/admin/posts/${id}`);
        }
      }}
    />
  );
}
