import Link from "next/link";
import { BrandMark } from "./brand-mark";

const navigation = [
  ["How it works", "/system"],
  ["Projects", "/projects"],
  ["Research", "/research"],
  ["Writing", "/writing"],
  ["Now", "/now"],
  ["About", "/about"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="Ordivon home"><BrandMark /><span>ORDIVON</span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <a className="nav-external" href="https://github.com/zycxfyh/ordivon-computing">Source <span aria-hidden="true">↗</span></a>
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<a href="https://github.com/zycxfyh/ordivon-computing">Source ↗</a></nav>
        </details>
      </div>
    </header>
  );
}
