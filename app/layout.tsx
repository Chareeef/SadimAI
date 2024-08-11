import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./components/Providers";
import "./globals.css";
import "highlight.js/styles/tomorrow-night-blue.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat With Bot",
  description: "AI Chatbot for customer support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
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
      </Head>

      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
