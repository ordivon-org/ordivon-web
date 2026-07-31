import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "../styles/visual-language.css";
import "../styles/system.css";
import "../styles/research.css";
import "../styles/writing.css";
import "../styles/motion.css";
import "../styles/home.css";
import "../styles/editorial.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ordivon.com"),
  title: { default: "Ordivon — Durable work for AI agents", template: "%s — Ordivon" },
  description: "Independent research and engineering for AI work that can continue, recover, and remain verifiable across model sessions, processes, machines, and providers.",
  applicationName: "Ordivon",
  authors: [{ name: "zycxfyh", url: "https://github.com/zycxfyh" }],
  creator: "zycxfyh",
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    siteName: "Ordivon",
    locale: "en_US",
    title: "Ordivon — Durable work for AI agents",
    description: "Systems that preserve task meaning, execution evidence, and recovery when models, sessions, processes, or providers change.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Ordivon — durable work for AI agents" }],
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
