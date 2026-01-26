"use client";

import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ToolbarAction = {
  label: string;
  wrap?: { before: string; after: string };
  insert?: string;
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { label: "H2", insert: "## " },
  { label: "H3", insert: "### " },
  { label: "Bold", wrap: { before: "**", after: "**" } },
  { label: "Italic", wrap: { before: "*", after: "*" } },
  { label: "Quote", insert: "> " },
  { label: "List", insert: "- " },
  { label: "Code", wrap: { before: "`", after: "`" } },
  { label: "Link", wrap: { before: "[", after: "](https://)" } },
];

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [view, setView] = useState<"write" | "preview">("write");

  const preview = useMemo(() => value.trim(), [value]);

  function applyToolbar(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selected = value.slice(start, end);
    let nextValue = value;
    let cursorPosition = end;

    if (action.wrap) {
      const before = action.wrap.before;
      const after = action.wrap.after;
      nextValue =
        value.slice(0, start) +
        before +
        (selected || "text") +
        after +
        value.slice(end);
      cursorPosition = start + before.length + (selected || "text").length + after.length;
    } else if (action.insert) {
      const prefix = action.insert;
      nextValue = value.slice(0, start) + prefix + value.slice(start);
      cursorPosition = start + prefix.length;
    }

    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-4 py-3">
        <div className="flex flex-wrap gap-2 text-xs text-slate-200">
          {TOOLBAR_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="rounded-full border border-slate-700 px-3 py-1 transition hover:border-blue-400 hover:text-white"
              onClick={() => applyToolbar(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-full border border-slate-700 text-xs">
          <button
            type="button"
            className={`rounded-full px-3 py-1 transition ${
              view === "write"
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:text-white"
            }`}
            onClick={() => setView("write")}
          >
            Write
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1 transition ${
              view === "preview"
                ? "bg-blue-500 text-white"
                : "text-slate-300 hover:text-white"
            }`}
            onClick={() => setView("preview")}
          >
            Preview
          </button>
        </div>
      </div>

      {view === "write" ? (
        <textarea
          ref={textareaRef}
          className="min-h-[320px] w-full rounded-b-2xl bg-transparent px-4 py-4 text-sm text-white focus:outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <div className="prose prose-invert max-w-none px-6 py-6">
          {preview ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {preview}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-slate-400">
              Nothing to preview yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
