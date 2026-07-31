import type { Metadata } from "next";
import Link from "next/link";
import { SystemMap } from "@/components/system-map";

export const metadata: Metadata = {
  title: "About",
  description: "How Ordivon began, why one independent maintainer is building it, the principles that emerged through use, and the long-term ambition for durable AI work.",
  alternates: { canonical: "/about" },
};

const principles = [
  ["Thin core", "Keep only responsibilities that own a failure another layer cannot safely reconstruct after interruption."],
  ["High potential", "Leave room for stronger models, new providers, and unfamiliar workloads instead of freezing today's limitations into the architecture."],
  ["Low governance", "Use judgment and recoverability before adding permanent approval, policy, or coordination machinery."],
  ["High recoverability", "Make experiments, deletions, and aggressive iteration cheap enough that the system can learn without protecting every intermediate structure."],
] as const;

const method = [
  "Begin with observed friction, uncertainty, failure, or an unexplained decision.",
  "Compare the proposed solution with mature systems and the simplest direct alternative.",
  "Build the smallest experiment that can change the architecture or delete the idea.",
  "Preserve source, receipts, results, limits, and negative evidence.",
  "Keep the boundary only when another real workload still needs it.",
] as const;

export default function AboutPage() {
  return (
    <div className="page-shell page-top about-page">
      <header className="index-hero about-hero">
        <p className="eyebrow">About</p>
        <h1>Ordivon began with a simple failure: capable models could do useful work, but the work itself did not survive them.</h1>
        <p>A model session could reason, write code, and call tools, yet the larger task, accepted decisions, process state, external consequences, and evidence often remained trapped inside one conversation or one transient runtime.</p>
      </header>

      <section className="about-origin" aria-labelledby="about-origin-title">
        <div><p className="section-index">Origin</p><h2 id="about-origin-title">Separate intelligence from the work that must endure.</h2></div>
        <div>
          <p>Ordivon grew from repeated attempts to continue real engineering work across session loss, model replacement, process restart, and changing external conditions. The recurring problem was not that models lacked intelligence. It was that the surrounding system gave transient cognition ownership over facts that needed to remain durable.</p>
          <p>That failure connected what became Computing, Host, Runtime, and World: research the contracts, preserve task meaning, commit local work with evidence, and reconcile external action without blind repetition.</p>
        </div>
      </section>

      <section className="about-maintainer" aria-labelledby="about-maintainer-title">
        <div><p className="section-index">Independent maintainer</p><h2 id="about-maintainer-title">Built in public by zycxfyh.</h2></div>
        <div>
          <p>Ordivon is an independent research and engineering effort maintained under the public handle <strong>zycxfyh</strong>. The repositories, experiments, and published arguments are the durable public work surface.</p>
          <p>Independence allows boundaries to be challenged, repositories to be merged or deleted, and experiments to contradict earlier judgment without protecting an organizational roadmap. Claims therefore earn trust through source, tests, receipts, and reproducible evidence rather than institutional authority.</p>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="about-principles-title">
        <div className="about-section-heading"><p className="section-index">Principles discovered through use</p><h2 id="about-principles-title">Make capability cheap to extend and mistakes cheap to reverse.</h2></div>
        <div className="about-principle-grid">
          {principles.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <SystemMap compact />

      <section className="about-ambition" aria-labelledby="about-ambition-title">
        <p className="section-index">Long-term ambition</p>
        <h2 id="about-ambition-title">AI work should become less session-bound, more recoverable, and easier to verify.</h2>
        <p>The long-term goal is not to force every agent through one stack. It is to identify the small set of durable responsibilities that let intelligence, tools, machines, providers, and human judgment change without destroying the work trajectory they are serving.</p>
        <div className="actions"><Link className="button primary" href="/system">See the current architecture</Link><Link className="button text" href="/research">Follow what remains uncertain</Link></div>
      </section>

      <section className="method-list" aria-labelledby="about-method-title">
        <p className="section-index" id="about-method-title">Working method</p>
        {method.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}
      </section>

      <section className="contact-block" id="contact">
        <p className="section-index">Critique, evidence, and contribution</p>
        <h2>Challenge the boundary, not just the wording.</h2>
        <p>Technical criticism is most useful when it identifies a mature alternative, a missing failure mode, contradictory evidence, or a simpler owner for the same responsibility. Use the relevant repository issue or pull request so the argument remains connected to source and history.</p>
        <div className="actions"><a className="button primary" href="https://github.com/zycxfyh">Open GitHub ↗</a><Link className="button text" href="/writing">Read the published arguments</Link></div>
      </section>
    </div>
  );
}
