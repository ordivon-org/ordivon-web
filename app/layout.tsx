import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "../styles/visual-language.css";
import "../styles/system.css";
import "../styles/research.css";
import "../styles/writing.css";
import "../styles/motion.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ordivon.com"),
  title: { default: "Ordivon — Persistent work for capable agents", template: "%s — Ordivon" },
  description: "Ordivon builds persistent Task continuity, recoverable execution, path evidence, hosted capabilities, and durable public records for capable agents.",
  applicationName: "Ordivon",
  authors: [{ name: "zycxfyh", url: "https://github.com/zycxfyh" }],
  creator: "zycxfyh",
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    siteName: "Ordivon",
    locale: "en_US",
    title: "Ordivon — Persistent work for capable agents",
    description: "Systems for Task continuity, committed effects, recoverable paths, hosted capabilities, and durable evidence.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Ordivon — persistent work for capable agents" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image.png"] },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
