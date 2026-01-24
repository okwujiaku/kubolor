import Link from "next/link";

type PostCardProps = {
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string | null;
};

export function PostCard({ title, slug, excerpt, category }: PostCardProps) {
  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        {category ? (
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {category}
          </p>
        ) : null}
        <h3 className="text-lg font-semibold">
          <Link href={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        {excerpt ? (
          <p className="text-sm text-muted-foreground">{excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}
