import Link from "next/link";

const nodes = [
  { href: "/projects/computing", index: "01", title: "Computing", detail: "contracts" },
  { href: "/projects/host", index: "02", title: "Host", detail: "tasks" },
  { href: "/projects/runtime", index: "03", title: "Runtime", detail: "local effects" },
  { href: "/projects/world", index: "04", title: "World", detail: "external interaction" },
];

export function SystemMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "system-map compact" : "system-map"} aria-label="Ordivon system map">
      <div className="map-axis"><span>semantic continuity</span><span>physical reality</span></div>
      <div className="map-track" aria-hidden="true" />
      {nodes.map((node, index) => (
        <Link className={`map-node node-${index + 1}`} href={node.href} key={node.href}>
          <span>{node.index}</span><strong>{node.title}</strong><small>{node.detail}</small>
        </Link>
      ))}
      <div className="map-caption"><span>Replaceable cognition</span><span>Conditioned evidence</span></div>
    </div>
  );
}
