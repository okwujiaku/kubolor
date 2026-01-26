import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import Link from "next/link";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = getSiteUrl();
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Kubolor",
      url: siteUrl,
      logo: `${siteUrl}/kubolor-logo.png`,
      sameAs: [
        "https://facebook.com",
        "https://x.com",
        "https://youtube.com",
        "https://instagram.com",
        "https://tiktok.com",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Kubolor",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Kubolor",
    template: "%s | Kubolor",
  },
  description: "AI-powered SEO blogging platform",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Kubolor",
    description: "AI-powered SEO blogging platform",
    siteName: "Kubolor",
    images: [
      {
        url: "/kubolor-logo.png",
        width: 1200,
        height: 630,
        alt: "Kubolor logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kubolor",
    description: "AI-powered SEO blogging platform",
    images: ["/kubolor-logo.png"],
  },
  icons: {
    icon: "/kubolor-logo.png",
    apple: "/kubolor-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kubolor",
    url: siteUrl,
    logo: `${siteUrl}/kubolor-logo.png`,
  };

  const schemaWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kubolor",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${jakarta.variable} min-h-screen bg-[#FDF8F5] text-slate-900 antialiased`}
        >
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
          <Script
            id="schema-org"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([schemaOrg, schemaWebSite]),
            }}
          />
          {!isAdminPage && (
            <header className="border-b border-rose-100/70 bg-[#FDF8F5]/90">
              <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
                <Link href="/" className="flex items-center gap-3 -ml-1">
                  <span className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    Kubolor.com
                  </span>
                </Link>
                <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold">
                  <Link
                    href="/"
                    className="text-slate-700 transition-colors hover:text-blue-600"
                  >
                    Home
                  </Link>
                  <Link
                    href="/blog"
                    className="text-slate-700 transition-colors hover:text-blue-600"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/blog"
                    className="text-slate-700 transition-colors hover:text-blue-600"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/about"
                    className="text-slate-700 transition-colors hover:text-blue-600"
                  >
                    About
                  </Link>
                </nav>
              </div>
            </header>
          )}
          {children}
          {!isAdminPage && (
            <footer className="border-t border-rose-100/70 bg-white/80">
              <div className="mx-auto w-full max-w-7xl px-6 py-12">
                <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-horizon text-3xl font-extrabold italic tracking-tight text-slate-900">
                        Kubolor
                      </span>
                    </div>
                    <p className="max-w-sm text-sm text-slate-600">
                      Professional AI-powered SEO blogging platform for founders,
                      creators, and growing teams.
                    </p>
                    <p className="text-xs text-slate-500">
                      © {new Date().getFullYear()} Kubolor. All rights reserved.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900">About</p>
                    <p className="text-sm text-slate-600">
                      Kubolor helps you publish high-performing content with AI
                      workflows, SEO intelligence, and editorial tools built for
                      scale.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900">Product</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>
                        <Link
                          href="/blog"
                          className="transition-colors hover:text-blue-600"
                        >
                          Brand Assets
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/blog"
                          className="transition-colors hover:text-blue-600"
                        >
                          About Us
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900">Legal</p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li>
                        <Link
                          href="/privacy-policy"
                          className="transition-colors hover:text-blue-600"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/terms-of-service"
                          className="transition-colors hover:text-blue-600"
                        >
                          Terms of Service
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/refund-policy"
                          className="transition-colors hover:text-blue-600"
                        >
                          Refund Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/support"
                          className="transition-colors hover:text-blue-600"
                        >
                          Live Chat Support
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-rose-100/70 pt-6">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <span>Follow us:</span>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://facebook.com"
                        aria-label="Facebook"
                        className="rounded-md bg-[#1877F2] p-2 text-white transition hover:opacity-90"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M13.5 8.5V6.8c0-.7.5-1.1 1.1-1.1h1.7V3h-2.2C11.5 3 10 4.6 10 6.9v1.6H8v2.6h2V21h3.5v-9.9h2.4l.4-2.6h-2.8z" />
                        </svg>
                      </a>
                      <a
                        href="https://x.com"
                        aria-label="X"
                        className="rounded-md bg-black p-2 text-white transition hover:opacity-90"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.9 3H21l-6.6 7.5L22 21h-6.2l-4-5.2L7.1 21H5l7-8.1L2 3h6.3l3.6 4.7L18.9 3z" />
                        </svg>
                      </a>
                      <a
                        href="https://youtube.com"
                        aria-label="YouTube"
                        className="rounded-md bg-[#FF0000] p-2 text-white transition hover:opacity-90"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21.6 7.2a2.7 2.7 0 00-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 002.4 7.2 28 28 0 002 12a28 28 0 00.4 4.8 2.7 2.7 0 001.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 001.9-1.9A28 28 0 0022 12a28 28 0 00-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
                        </svg>
                      </a>
                      <a
                        href="https://instagram.com"
                        aria-label="Instagram"
                        className="rounded-md bg-[#E1306C] p-2 text-white transition hover:opacity-90"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M16.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3zm2.7 13.5a2.7 2.7 0 01-2.7 2.7h-9a2.7 2.7 0 01-2.7-2.7v-9a2.7 2.7 0 012.7-2.7h9a2.7 2.7 0 012.7 2.7zm-7.2-9a4.5 4.5 0 104.5 4.5 4.5 4.5 0 00-4.5-4.5zm0 7.4a2.9 2.9 0 112.9-2.9 2.9 2.9 0 01-2.9 2.9zm4.8-7.9a1.1 1.1 0 11-1.1-1.1 1.1 1.1 0 011.1 1.1z" />
                        </svg>
                      </a>
                      <a
                        href="https://tiktok.com"
                        aria-label="TikTok"
                        className="rounded-md bg-black p-2 text-white transition hover:opacity-90"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17 3h-3v11.2a2.8 2.8 0 11-2.4-2.8v-3A6 6 0 1016 15.4V8.7a6.6 6.6 0 004.2 1.5V7.3A3.8 3.8 0 0117 3z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Built with ❤️ for creators worldwide.
                  </p>
                </div>
              </div>
            </footer>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
