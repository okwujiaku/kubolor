type CTABlockProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export function CTABlock({
  title,
  description,
  ctaLabel,
  ctaHref,
}: CTABlockProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-slate-200">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
      <a
        href={ctaHref}
        className="mt-4 inline-flex text-sm font-medium text-blue-300 hover:text-blue-200"
      >
        {ctaLabel}
      </a>
    </section>
  );
}
