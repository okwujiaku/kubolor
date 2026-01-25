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
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">
      <p className="text-xs font-semibold uppercase text-slate-400">
        Recommended tool
      </p>
      <h4 className="mt-2 text-lg font-semibold text-white">{toolName}</h4>
      {description ? (
        <p className="mt-2 text-sm text-slate-300">{description}</p>
      ) : null}
      <a
        href={url}
        className="mt-4 inline-flex text-sm font-medium text-blue-300 hover:text-blue-200"
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn more
      </a>
    </aside>
  );
}
