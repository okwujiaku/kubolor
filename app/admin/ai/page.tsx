export default function AdminAIGeneratorPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold">AI article generator</h2>
        <p className="text-sm text-muted-foreground">
          Provide inputs to generate SEO-optimized draft content.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed p-8 text-sm text-muted-foreground">
        Inputs: Topic, Keywords, Tone, Length. Button: Generate Article. This
        will call `/api/ai/generate`.
      </div>
    </section>
  );
}
