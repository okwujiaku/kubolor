export default function AdminAIGeneratorPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-horizon text-xl font-semibold text-white">
          AI article generator
        </h2>
        <p className="text-sm text-slate-300">
          Provide inputs to generate SEO-optimized draft content.
        </p>
      </header>

      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-sm text-slate-300">
        Inputs: Topic, Keywords, Tone, Length. Button: Generate Article. This
        will call `/api/ai/generate`.
      </div>
    </section>
  );
}
