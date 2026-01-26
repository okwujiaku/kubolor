"use client";

import { UserButton } from "@clerk/nextjs";

export function AdminUserMenu() {
  return (
    <div className="rounded-full border border-slate-800 bg-slate-900/70 p-1">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
