import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteTitle = "Sadim AI — Fast thinking, beautifully clear";
const siteDescription =
  "A fast, focused AI workspace for ideas, answers, writing, and everyday problem-solving.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sadim-ai.com"),
  title: {
    default: siteTitle,
    template: "%s · Sadim AI",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/android-chrome-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Sadim AI",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 627,
        alt: "Sadim AI — Nebula Intelligence",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 627,
        alt: "Sadim AI — Nebula Intelligence",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
