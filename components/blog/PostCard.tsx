import Link from "next/link";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  category?: string;
}

export function PostCard({ title, slug, excerpt, category }: PostCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/30 transition hover:border-blue-400/60 hover:shadow-blue-500/20">
      <div className="space-y-3">
        {category && (
          <span className="inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">
            {category}
          </span>
        )}
        <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-blue-300">
          <Link href={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        {excerpt && (
          <p className="text-sm text-slate-300 line-clamp-2">{excerpt}</p>
        )}
        <div className="pt-2">
          <Link 
            href={`/blog/${slug}`}
            className="text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
