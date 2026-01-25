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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Horizon&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900 antialiased`}>
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/Kubolor Logo.png" 
                alt="Kubolor Logo" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span style={{ fontFamily: 'Horizon, sans-serif' }} className="text-2xl font-bold text-blue-600">
                Kubolor
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link href="/admin" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
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
