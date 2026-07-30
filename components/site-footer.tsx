import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-statement">
          <div className="brand footer-brand"><BrandMark /><span>ORDIVON</span></div>
          <p>Persistent work. Recoverable execution. Durable evidence.</p>
        </div>
        <div className="footer-links">
          <div><span>Explore</span><Link href="/projects">Projects</Link><Link href="/writing">Writing</Link><Link href="/now">Current</Link></div>
          <div><span>Context</span><Link href="/about">About</Link><Link href="/colophon">Colophon</Link><a href="/feed.xml">RSS</a></div>
          <div><span>Source</span><a href="https://github.com/zycxfyh">GitHub</a><a href="https://github.com/zycxfyh/ordivon-web">Web repository</a></div>
        </div>
      </div>
      <div className="footer-base"><span>© 2026 Ordivon</span><span>Built in public by zycxfyh</span></div>
    </footer>
  );
}
