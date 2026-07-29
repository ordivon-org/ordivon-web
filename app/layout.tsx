import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ordivon.com"),
  title: { default: "Ordivon Web V2", template: "%s — Ordivon" },
  description: "The public narrative, research publishing, visualization, and evidence-navigation surface for Ordivon.",
  openGraph: { type: "website", siteName: "Ordivon", locale: "en_US" },
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header site-shell">
          <Link href="/" aria-label="Ordivon home"><strong>ORDIVON</strong></Link>
          <nav aria-label="Primary navigation">
            <Link href="/projects">Projects</Link>
            <Link href="/writing">Writing</Link>
            <Link href="/preview-mdx">MDX proof</Link>
          </nav>
        </header>
        <main className="site-shell">{children}</main>
        <footer className="site-footer site-shell">Round 1 technical proof — not the production design.</footer>
      </body>
    </html>
  );
}
