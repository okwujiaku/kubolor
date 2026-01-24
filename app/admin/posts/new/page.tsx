export default function AdminNewPostPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">Create new post</h2>
        <p className="text-sm text-muted-foreground">
          Draft a new article and save it as a draft or publish immediately.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
        Form UI will live here. We will wire this to `/api/posts/create` and
        `/api/posts/publish` in the next step.
      </div>
    </section>
  );
}
