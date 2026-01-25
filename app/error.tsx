"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-20 text-slate-200">
      <h1 className="font-horizon text-3xl text-white">
        Something went wrong
      </h1>
      <p className="text-slate-300">
        We ran into a temporary issue. Please refresh the page or try again in a
        moment.
      </p>
      <button
        onClick={reset}
        className="w-fit rounded-lg bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-400"
      >
        Try again
      </button>
    </main>
  );
}
