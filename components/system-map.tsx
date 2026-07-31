import Link from "next/link";
import { systems } from "@/content/model";

const nodeDetails: Record<string, string> = {
  computing: "contracts + conformance",
  host: "Goals + Tasks",
  runtime: "committed local effects",
  world: "conditioned external action",
};

const nodes = [...systems].sort((a, b) => a.index.localeCompare(b.index));

export function SystemMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`system-overview ${compact ? "compact" : ""}`} aria-label="Ordivon state ownership overview">
      <div className="system-overview-head">
        <span>Four independent state owners</span>
        <Link href="/system">Explore architecture <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="system-overview-stage">
        <svg viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
          <path className="highlight" d="M 450 170 C 340 80, 265 80, 150 170" />
          <path className="highlight" d="M 450 170 C 555 260, 650 260, 750 170" />
          <path d="M 1050 170 C 800 360, 390 360, 150 170" />
        </svg>
        <div className="system-overview-nodes">
          {nodes.map((node) => (
            <Link className={`system-overview-node status-${node.status}`} href={node.href || `/projects/${node.slug}`} key={node.id}>
              <div><span>{node.index}</span><i>{node.status}</i></div>
              <strong>{node.title}</strong>
              <small>{nodeDetails[node.slug] || node.question}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
