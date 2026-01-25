import Link from "next/link";

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  category?: string;
}

export function PostCard({ title, slug, excerpt, category }: PostCardProps) {
  return (
    <article className="group rounded-2xl border-2 border-blue-100 bg-white p-6 shadow-sm hover:border-blue-600 hover:shadow-lg transition-all">
      <div className="space-y-3">
        {category && (
          <span className="inline-block rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-600">
            {category}
          </span>
        )}
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2">{excerpt}</p>
        )}
        <div className="pt-2">
          <Link 
            href={`/blog/${slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
