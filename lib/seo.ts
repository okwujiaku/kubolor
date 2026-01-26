import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

type BuildPostMetadataInput = {
  title: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  featuredImage?: string | null;
  slug: string;
};

export function buildPostMetadata({
  title,
  excerpt,
  metaTitle,
  metaDescription,
  featuredImage,
  slug,
}: BuildPostMetadataInput): Metadata {
  const resolvedTitle = metaTitle ?? title;
  const resolvedDescription = metaDescription ?? excerpt ?? undefined;
  const url = `${getSiteUrl()}/blog/${slug}`;
  const fallbackImage = "/kubolor-logo.png";

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      type: "article",
      images: [{ url: featuredImage ?? fallbackImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [featuredImage ?? fallbackImage],
    },
  };
}
