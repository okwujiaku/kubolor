type AffiliateBlockProps = {
  toolName: string;
  description?: string | null;
  url: string;
};

export function AffiliateBlock({
  toolName,
  description,
  url,
}: AffiliateBlockProps) {
  return (
    <aside className="rounded-2xl border bg-muted/40 p-6">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        Recommended tool
      </p>
      <h4 className="mt-2 text-lg font-semibold">{toolName}</h4>
      {description ? (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      ) : null}
      <a
        href={url}
        className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn more
      </a>
    </aside>
  );
}
