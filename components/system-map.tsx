import Link from "next/link";
import { getNodesByKind } from "@/lib/graph";

const nodeDetails: Record<string, string> = {
  computing: "contracts",
  host: "tasks",
  runtime: "local effects",
  world: "external interaction",
};

const nodes = getNodesByKind("system").sort((a, b) => a.index.localeCompare(b.index));

export function SystemMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "system-map compact" : "system-map"} aria-label="Ordivon system map">
      <div className="map-axis"><span>semantic continuity</span><span>physical reality</span></div>
      <div className="map-track" aria-hidden="true" />
      {nodes.map((node, index) => (
        <Link className={`map-node node-${index + 1}`} href={node.href || `/projects/${node.slug}`} key={node.id}>
          <span>{node.index}</span><strong>{node.title}</strong><small>{nodeDetails[node.slug] || node.status}</small>
        </Link>
      ))}
      <div className="map-caption"><span>Replaceable cognition</span><span>Conditioned evidence</span></div>
    </div>
  );
}
