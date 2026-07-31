import Link from "next/link";

const recovery = [
  ["Projects", "See what each Ordivon project currently does and how mature it is.", "/projects"],
  ["Research", "Follow the questions and experiments that can still change the architecture.", "/research"],
  ["Writing", "Read the complete arguments, reports, releases, and evidence.", "/writing"],
] as const;

export default function NotFound() {
  return (
    <section className="not-found page-shell page-top">
      <p className="eyebrow">404 / Page not found</p>
      <h1>This page may have moved, been renamed, or been removed.</h1>
      <p>Ordivon deliberately merges and retires projects when a boundary no longer earns its cost. Continue from the current project, research, or writing indexes.</p>
      <div className="not-found-recovery">
        {recovery.map(([title, description, href]) => <Link href={href} key={href}><strong>{title}</strong><span>{description}</span><b aria-hidden="true">↗</b></Link>)}
      </div>
      <Link className="button text" href="/">Return to the homepage</Link>
    </section>
  );
}
