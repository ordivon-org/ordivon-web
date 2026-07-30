import Link from "next/link";
import { BrandMark } from "./brand-mark";

const navigation = [
  ["System", "/system"],
  ["Research", "/research"],
  ["Projects", "/projects"],
  ["Writing", "/writing"],
  ["Current", "/now"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="Ordivon home">
          <BrandMark />
          <span>ORDIVON</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <a className="nav-external" href="https://github.com/zycxfyh">GitHub <span aria-hidden="true">↗</span></a>
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <a href="https://github.com/zycxfyh">GitHub ↗</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
