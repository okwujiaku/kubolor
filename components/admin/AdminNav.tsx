"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Overview & performance",
  },
  {
    href: "/admin/posts",
    label: "Posts",
    description: "Manage content",
  },
  {
    href: "/admin/posts/new",
    label: "New Post",
    description: "Write a draft",
  },
  {
    href: "/admin/ai",
    label: "AI Generator",
    description: "Generate drafts",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-2xl border px-4 py-3 text-sm transition ${
              isActive
                ? "border-blue-400/60 bg-blue-500/10 text-blue-200"
                : "border-slate-800 text-slate-300 hover:border-blue-400/40 hover:text-blue-200"
            }`}
          >
            <div className="font-semibold">{item.label}</div>
            <div className="text-xs text-slate-400">{item.description}</div>
          </Link>
        );
      })}
    </nav>
  );
}
