import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-statement"><div className="brand footer-brand"><BrandMark /><span>ORDIVON</span></div><p>Durable work, replaceable intelligence, evidence that survives interruption.</p></div>
        <div className="footer-links">
          <div><span>Understand</span><Link href="/system">How it works</Link><Link href="/projects">Project map</Link><Link href="/now">Current status</Link></div>
          <div><span>Read</span><Link href="/research">Research</Link><Link href="/writing">Writing</Link><Link href="/about">About</Link><Link href="/colophon">Colophon</Link></div>
          <div><span>Source</span><a href="https://github.com/zycxfyh/ordivon-computing">Computing root</a><a href="https://github.com/zycxfyh?tab=repositories">All repositories</a><a href="https://github.com/zycxfyh/ordivon-web">Web repository</a><a href="/feed.xml">Atom feed</a></div>
        </div>
      </div>
      <div className="footer-base"><span>© 2026 Ordivon</span><span>Built in public by zycxfyh</span></div>
    </footer>
  );
}
