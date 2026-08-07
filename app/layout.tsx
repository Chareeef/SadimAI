import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Sadim AI — Fast thinking, beautifully clear",
    template: "%s · Sadim AI",
  },
  description:
    "A fast, focused AI workspace for ideas, answers, writing, and everyday problem-solving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />

        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />

        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />

        <link
          rel="icon"
          href="/android-chrome?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>

      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
