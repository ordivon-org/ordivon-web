"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { SystemPerspective, SystemViewEdge, SystemViewId, SystemViewNode } from "@/lib/graph/system-views";

function edgePath(edge: SystemViewEdge) {
  const source = edge.sourceNode;
  const target = edge.targetNode;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const direction = Math.sign(dx) || 1;
    const startX = source.x + direction * source.width / 2;
    const endX = target.x - direction * target.width / 2;
    const bend = Math.max(70, Math.abs(endX - startX) * 0.42);
    return `M ${startX} ${source.y} C ${startX + direction * bend} ${source.y}, ${endX - direction * bend} ${target.y}, ${endX} ${target.y}`;
  }
  const direction = Math.sign(dy) || 1;
  const startY = source.y + direction * source.height / 2;
  const endY = target.y - direction * target.height / 2;
  const bend = Math.max(70, Math.abs(endY - startY) * 0.42);
  return `M ${source.x} ${startY} C ${source.x} ${startY + direction * bend}, ${target.x} ${endY - direction * bend}, ${target.x} ${endY}`;
}

function edgeLabel(edge: SystemViewEdge) {
  return edge.type.replaceAll("_", " ");
}

function edgeLabelPosition(edge: SystemViewEdge) {
  return {
    x: (edge.sourceNode.x + edge.targetNode.x) / 2,
    y: (edge.sourceNode.y + edge.targetNode.y) / 2,
  };
}

function nodeIsConnected(node: SystemViewNode, activeId: string | null, edges: SystemViewEdge[]) {
  if (!activeId) return true;
  if (node.id === activeId) return true;
  return edges.some((edge) =>
    (edge.source === activeId && edge.target === node.id) ||
    (edge.target === activeId && edge.source === node.id),
  );
}


const subscribeToHydration = () => () => undefined;

export function SystemExplorer({ perspectives }: { perspectives: SystemPerspective[] }) {
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [viewId, setViewId] = useState<SystemViewId>(perspectives[0]?.id || "structure");
  const perspective = perspectives.find((item) => item.id === viewId) || perspectives[0];
  const [selectedId, setSelectedId] = useState(perspective.defaultNodeId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = hoveredId || selectedId;


  const activeNode = useMemo(
    () => perspective.nodes.find((node) => node.id === activeId) || perspective.nodes.find((node) => node.id === selectedId) || perspective.nodes[0],
    [activeId, perspective, selectedId],
  );

  function changeView(nextId: SystemViewId) {
    const next = perspectives.find((item) => item.id === nextId);
    if (!next) return;
    setViewId(nextId);
    setSelectedId(next.defaultNodeId);
    setHoveredId(null);
  }

  return (
    <section className="system-explorer" aria-labelledby="system-explorer-title" aria-busy={!ready} data-ready={ready ? "true" : "false"}>
      <div className="system-explorer-head">
        <div>
          <p>{perspective.kicker}</p>
          <h2 id="system-explorer-title">{perspective.label} view</h2>
          <span>{perspective.description}</span>
        </div>
        <div className="system-view-switcher" role="group" aria-label="System graph perspective">
          {perspectives.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={item.id === perspective.id}
              onClick={() => changeView(item.id)}
            >
              <span>{item.label}</span>
              <small>{item.kicker}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="system-explorer-body">
        <div className="system-canvas-wrap">
          <div className="system-canvas-meta">
            <span>{perspective.nodes.length} visible nodes</span>
            <span>{perspective.edges.length} typed relations</span>
            <span>Hover or focus to inspect</span>
          </div>
          <svg className="system-canvas" viewBox="0 0 1200 680" role="group" aria-label={`${perspective.label} system graph`}>
            <defs>
              <marker id="system-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            </defs>

            <g className="system-grid-lines" aria-hidden="true">
              {[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x) => <line x1={x} y1="0" x2={x} y2="680" key={`x-${x}`} />)}
              {[110, 220, 330, 440, 550].map((y) => <line x1="0" y1={y} x2="1200" y2={y} key={`y-${y}`} />)}
            </g>

            <g className="system-edges" aria-hidden="true">
              {perspective.edges.map((edge) => {
                const connected = !activeId || edge.source === activeId || edge.target === activeId;
                const position = edgeLabelPosition(edge);
                return (
                  <g className={`system-edge relation-${edge.type} ${connected ? "connected" : "muted"}`} key={edge.id}>
                    <path d={edgePath(edge)} markerEnd="url(#system-arrow)" />
                    <g className="system-edge-label" transform={`translate(${position.x} ${position.y})`}>
                      <rect x="-54" y="-11" width="108" height="22" rx="11" />
                      <text textAnchor="middle" dominantBaseline="central">{edgeLabel(edge)}</text>
                    </g>
                  </g>
                );
              })}
            </g>

            <g className="system-nodes">
              {perspective.nodes.map((node, index) => {
                const selected = node.id === selectedId;
                const active = node.id === activeId;
                const connected = nodeIsConnected(node, activeId, perspective.edges);
                return (
                  <foreignObject
                    key={`${perspective.id}-${node.id}`}
                    x={node.x - node.width / 2}
                    y={node.y - node.height / 2}
                    width={node.width}
                    height={node.height}
                    className={`system-node-object ${connected ? "connected" : "muted"}`}
                    style={{ animationDelay: `${index * 42}ms` }}
                  >
                    <button
                      type="button"
                      className={`graph-node-card kind-${node.kind} status-${node.status} ${selected ? "selected" : ""} ${active ? "active" : ""}`}
                      aria-label={`${node.label}. ${node.title}. ${node.summary}`}
                      aria-pressed={selected}
                      onClick={() => setSelectedId(node.id)}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(node.id)}
                      onBlur={() => setHoveredId(null)}
                    >
                      <span className="graph-node-meta"><b>{node.kind}</b><i>{node.status}</i></span>
                      <strong>{node.label}</strong>
                      <small>{node.detail}</small>
                    </button>
                  </foreignObject>
                );
              })}
            </g>
          </svg>

          <div className="system-mobile-nodes" aria-label={`${perspective.label} nodes`}>
            {perspective.nodes.map((node) => (
              <button
                type="button"
                key={`mobile-${perspective.id}-${node.id}`}
                className={`system-mobile-node kind-${node.kind} ${node.id === selectedId ? "selected" : ""}`}
                aria-label={`${node.label}. ${node.title}. ${node.summary}`}
                aria-pressed={node.id === selectedId}
                onClick={() => setSelectedId(node.id)}
                onFocus={() => setHoveredId(node.id)}
                onBlur={() => setHoveredId(null)}
              >
                <span>{node.kind} · {node.status}</span>
                <strong>{node.label}</strong>
                <small>{node.detail}</small>
              </button>
            ))}
          </div>
        </div>

        {activeNode && (
          <aside className={`system-inspector kind-${activeNode.kind}`} aria-live="polite" aria-label="Selected graph node">
            <div className="system-inspector-head">
              <span>{activeNode.kind}</span>
              <i>{activeNode.status}</i>
            </div>
            <h3>{activeNode.title}</h3>
            <p>{activeNode.summary}</p>

            <dl className="system-inspector-facts">
              {activeNode.facts.map((fact) => (
                <div key={`${activeNode.id}-${fact.label}`}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="system-inspector-relations">
              <p>Known relations</p>
              {activeNode.connections.length ? (
                <ul>
                  {activeNode.connections.map((connection) => (
                    <li key={connection.id}>
                      <span>{connection.direction === "outgoing" ? "→" : "←"} {connection.label}</span>
                      <strong>{connection.otherTitle}</strong>
                    </li>
                  ))}
                </ul>
              ) : <span>No typed relations in the current graph.</span>}
            </div>

            {activeNode.href && (
              <Link className="system-inspector-link" href={activeNode.href}>
                Open this object <span aria-hidden="true">↗</span>
              </Link>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
