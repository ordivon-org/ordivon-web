import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon",
  description: "How Ordivon Web publishes, verifies, and deploys the public record.",
  alternates: { canonical: "/colophon" },
};

const facts = [
  ["Framework", "Next.js App Router + React"],
  ["Writing", "Typed metadata + composable MDX"],
  ["Delivery", "Static export via GitHub Pages"],
  ["Verification", "TypeScript, ESLint, Chromium smoke, focused axe checks"],
  ["Recovery", "Git history + redeploy"],
  ["State", "Structured content at build time; no application backend"],
] as const;

export default function ColophonPage() {
  return (
    <div className="page-shell page-top colophon-page">
      <header className="index-hero">
        <p className="eyebrow">Colophon</p>
        <h1>The publication system should earn its machinery.</h1>
        <p>
          Ordivon Web is the editorial and evidence-navigation layer around independent projects. It can become
          sophisticated without claiming ownership of the facts it presents—or carrying a server runtime it does not need.
        </p>
      </header>
      <section className="colophon-grid">
        {facts.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </section>
      <section className="about-split">
        <div>
          <p className="section-index">Publishing contract</p>
          <h2>Orientation here. Current truth at the source.</h2>
        </div>
        <div>
          <p>
            Project pages state the question, ownership boundary, current evidence, and next uncertainty. Articles preserve
            dated interpretation. Repositories, tests, receipts, and operational state remain canonical.
          </p>
          <p>
            Every public route is generated at build time and published through GitHub Pages. Cloudflare remains authoritative DNS only. Historical routes are materialized as static redirect documents, so the public site needs no database, ISR layer, Worker, or request-time application module.
          </p>
          <p>
            The repository keeps only checks that protect visible routes, content composition, and basic accessibility. Deployment recovery is a Git revert and redeploy, not a parallel evidence system.
          </p>
        </div>
      </section>
    </div>
  );
}
