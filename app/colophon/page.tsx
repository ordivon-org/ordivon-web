import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon",
  description: "How Ordivon Web publishes, verifies, and deploys the public record.",
  alternates: { canonical: "/colophon" },
};

const facts = [
  ["Framework", "Next.js App Router + React"],
  ["Writing", "Deterministic V1 migration + local MDX"],
  ["Delivery", "Static export on Cloudflare Pages"],
  ["Verification", "TypeScript, ESLint, Playwright, axe, Lighthouse"],
  ["Recovery", "Exact V1 archive, visual evidence, hashes, route map"],
  ["Production", "V1 remains live until explicit cutover"],
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
            Every public route is generated at build time. Cloudflare Pages serves immutable assets, redirects, security
            headers, RSS, metadata, and custom error pages without a database, ISR layer, or request-time application Worker.
          </p>
          <p>
            Production remains the archived V1 site until the account-hosted preview, release checks, cutover rehearsal, and
            rollback proof all pass together.
          </p>
        </div>
      </section>
    </div>
  );
}
