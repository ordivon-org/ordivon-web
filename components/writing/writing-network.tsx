"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { WritingAnchor, WritingNetwork } from "@/lib/graph/writing";

const subscribeToHydration = () => () => undefined;

function articlePosition(index: number, count: number, height: number) {
  const gap = height / Math.max(count, 1);
  return { x: 235, y: gap * index + gap / 2 };
}

function anchorPosition(index: number, count: number, height: number) {
  const gap = height / Math.max(count, 1);
  return { x: 965, y: gap * index + gap / 2 };
}

function edgePath(source: { x: number; y: number }, target: { x: number; y: number }) {
  const startX = source.x + 180;
  const endX = target.x - 180;
  const bend = Math.max(110, (endX - startX) * .42);
  return `M ${startX} ${source.y} C ${startX + bend} ${source.y}, ${endX - bend} ${target.y}, ${endX} ${target.y}`;
}

function anchorLabel(anchor: WritingAnchor) {
  if (anchor.kind === "question") return "Research Question";
  if (anchor.kind === "finding") return "Finding";
  if (anchor.kind === "decision") return "Decision";
  return "Project";
}

export function WritingNetworkExplorer({ network }: { network: WritingNetwork }) {
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [selectedId, setSelectedId] = useState(network.arguments[0]?.article.id || "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = hoveredId || selectedId;
  const active = useMemo(
    () => network.arguments.find((argument) => argument.article.id === activeId)
      || network.arguments.find((argument) => argument.article.id === selectedId)
      || network.arguments[0],
    [activeId, network.arguments, selectedId],
  );
  const connectedAnchorIds = new Set(active?.anchors.map((anchor) => anchor.id) || []);
  const height = Math.max(760, network.anchors.length * 92);

  return (
    <section className="writing-network" aria-labelledby="writing-network-title" aria-busy={!ready} data-ready={ready ? "true" : "false"}>
      <div className="writing-network-head">
        <div>
          <p>Argument network</p>
          <h2 id="writing-network-title">Articles are dated positions inside the research graph.</h2>
          <span>Select an argument to reveal the projects, Questions, findings, and decisions it documents.</span>
        </div>
        <dl>
          <div><dt>Arguments</dt><dd>{network.arguments.length}</dd></div>
          <div><dt>Claim anchors</dt><dd>{network.anchors.length}</dd></div>
          <div><dt>Document relations</dt><dd>{network.edges.length}</dd></div>
        </dl>
      </div>

      <div className="writing-network-body">
        <div className="writing-network-canvas-wrap">
          <div className="writing-network-canvas-meta">
            <span>Arguments</span><span>documents →</span><span>Research objects</span>
          </div>
          <svg className="writing-network-canvas" viewBox={`0 0 1200 ${height}`} role="group" aria-label="Writing argument network">
            <g className="writing-network-grid" aria-hidden="true">
              {[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x) => <line x1={x} y1="0" x2={x} y2={height} key={`x-${x}`} />)}
              {Array.from({ length: Math.ceil(height / 120) }, (_, index) => (index + 1) * 120).map((y) => <line x1="0" y1={y} x2="1200" y2={y} key={`y-${y}`} />)}
            </g>
            <g className="writing-network-edges" aria-hidden="true">
              {network.edges.map((edge) => {
                const articleIndex = network.arguments.findIndex((argument) => argument.article.id === edge.articleId);
                const anchorIndex = network.anchors.findIndex((anchor) => anchor.id === edge.anchorId);
                const connected = edge.articleId === activeId;
                return (
                  <path
                    className={connected ? "connected" : "muted"}
                    d={edgePath(articlePosition(articleIndex, network.arguments.length, height), anchorPosition(anchorIndex, network.anchors.length, height))}
                    key={edge.id}
                  />
                );
              })}
            </g>
            <g className="writing-network-articles">
              {network.arguments.map((argument, index) => {
                const position = articlePosition(index, network.arguments.length, height);
                const selected = argument.article.id === selectedId;
                const highlighted = argument.article.id === activeId;
                return (
                  <foreignObject x={position.x - 180} y={position.y - 48} width="360" height="96" key={argument.article.id}>
                    <button
                      type="button"
                      className={`writing-network-node kind-article ${selected ? "selected" : ""} ${highlighted ? "active" : ""}`}
                      aria-label={`${argument.article.articleType}. ${argument.article.title}. ${argument.article.summary}`}
                      aria-pressed={selected}
                      onClick={() => setSelectedId(argument.article.id)}
                      onMouseEnter={() => setHoveredId(argument.article.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(argument.article.id)}
                      onBlur={() => setHoveredId(null)}
                    >
                      <span>{argument.article.articleType} · {argument.article.date}</span>
                      <strong>{argument.article.title}</strong>
                      <small>{argument.anchors.length} anchors · centrality {argument.centrality}</small>
                    </button>
                  </foreignObject>
                );
              })}
            </g>
            <g className="writing-network-anchors">
              {network.anchors.map((anchor, index) => {
                const position = anchorPosition(index, network.anchors.length, height);
                const connected = connectedAnchorIds.has(anchor.id);
                return (
                  <foreignObject x={position.x - 180} y={position.y - 42} width="360" height="84" key={anchor.id}>
                    <div className={`writing-anchor-node kind-${anchor.kind} ${connected ? "connected" : "muted"}`}>
                      <span>{anchorLabel(anchor)}</span>
                      <strong>{anchor.title}</strong>
                    </div>
                  </foreignObject>
                );
              })}
            </g>
          </svg>

          <div className="writing-network-mobile" aria-label="Writing arguments">
            {network.arguments.map((argument) => (
              <button
                type="button"
                key={`mobile-${argument.article.id}`}
                className={argument.article.id === selectedId ? "selected" : ""}
                aria-pressed={argument.article.id === selectedId}
                onClick={() => setSelectedId(argument.article.id)}
              >
                <span>{argument.article.articleType} · {argument.article.date}</span>
                <strong>{argument.article.title}</strong>
                <small>{argument.anchors.length} connected research objects</small>
              </button>
            ))}
          </div>
        </div>

        {active && (
          <aside className="writing-network-inspector" aria-live="polite" aria-label="Selected writing argument">
            <div className="writing-network-inspector-head"><span>{active.article.articleType}</span><i>{active.article.project}</i></div>
            <h3>{active.article.title}</h3>
            <p>{active.article.summary}</p>
            <div className="writing-network-anchor-list">
              <p>Documents</p>
              {active.anchors.map((anchor) => anchor.href
                ? <Link className={`kind-${anchor.kind}`} href={anchor.href} key={anchor.id}><span>{anchorLabel(anchor)}</span><strong>{anchor.title}</strong></Link>
                : <div className={`kind-${anchor.kind}`} key={anchor.id}><span>{anchorLabel(anchor)}</span><strong>{anchor.title}</strong></div>)}
            </div>
            <div className="writing-network-related-list">
              <p>Nearest arguments</p>
              {active.related.slice(0, 3).map((connection) => (
                <Link href={`/writing/${connection.article.slug}`} key={connection.article.id}>
                  <span>{connection.sharedAnchors.map((anchor) => anchor.title).join(" · ")}</span>
                  <strong>{connection.article.title}</strong>
                </Link>
              ))}
            </div>
            <Link className="writing-network-open" href={`/writing/${active.article.slug}`}>Read this argument <span aria-hidden="true">↗</span></Link>
          </aside>
        )}
      </div>
    </section>
  );
}
