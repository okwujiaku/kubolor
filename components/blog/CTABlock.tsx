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
    <section className="rounded-2xl border bg-card p-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <a
        href={ctaHref}
        className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
      >
        {ctaLabel}
      </a>
    </section>
  );
}
