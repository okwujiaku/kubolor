export default function AdminNewPostPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-horizon text-xl font-semibold text-white">
          Create new post
        </h2>
        <p className="text-sm text-slate-300">
          Draft a new article and save it as a draft or publish immediately.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-sm text-slate-300">
        Form UI will live here. We will wire this to `/api/posts/create` and
        `/api/posts/publish` in the next step.
      </div>
    </section>
  );
}
