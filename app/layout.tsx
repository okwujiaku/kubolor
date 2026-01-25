import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kubolor",
  description: "AI-powered SEO blogging platform",
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}>
        <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/kubolor-logo.png"
                alt="Kubolor logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-horizon text-2xl font-bold text-blue-600">
                Kubolor
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/blog"
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                Blog
              </Link>
              <Link
                href="/admin"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
