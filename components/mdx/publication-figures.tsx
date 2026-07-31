import type { ReactNode } from "react";

const Arrow = () => <span className="publication-flow-arrow" aria-hidden="true">→</span>;

export function TokensToWorkFigure() {
  const nodes = [
    ["Prompt", "Intent enters one run"], ["Model", "Generates representations"], ["Harness", "Runs cognition and tools"],
    ["Host", "Preserves task meaning"], ["Runtime", "Commits local effects"], ["Evidence", "Supports completion"], ["Frontier", "Advances durable work"],
  ];
  return <div className="publication-flow" role="img" tabIndex={0} aria-label="Prompt flows through model, harness, host, runtime, evidence, and into the next durable work frontier">{nodes.map(([title, text], index) => <div className="publication-flow-step" key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{text}</small></div>).reduce<ReactNode[]>((all, node, index) => [...all, node, ...(index < nodes.length - 1 ? [<Arrow key={`a-${index}`} />] : [])], [])}</div>;
}

export function ReplacementFigure() {
  const orders = [["Codex", "Hermes"], ["Hermes", "Codex"]];
  return <div className="replacement-figure" role="img" aria-label="Both Codex to Hermes and Hermes to Codex replacement orders completed under one Host-owned task"><div className="replacement-metrics"><strong>4</strong><span>real provider runs</span><strong>2 / 2</strong><span>replacement orders</span><strong>3</strong><span>faults contained</span><strong>0</strong><span>blind redispatches</span></div>{orders.map(([left,right]) => <div className="replacement-order" key={left}><b>{left}</b><span>Assignment → run → artifact</span><Arrow /><b>{right}</b><span>new generation → verified completion</span></div>)}</div>;
}

export function CoreDispositionFigure() {
  const rows = [
    ["Task Runtime", "Durable workflow", "Remove"], ["Context Kernel", "Current-revision retrieval", "Reject"], ["Full Effect graph", "Idempotency + correlation", "Shrink"], ["DecisionRequest", "Local admission", "Localize"], ["Provider-neutral task state", "Live replacement", "Retain"],
  ];
  return <div className="disposition-figure" role="table" tabIndex={0} aria-label="Proposed Ordivon responsibilities compared against strong baselines"><div role="row"><b role="columnheader">Proposed boundary</b><b role="columnheader">Strong baseline</b><b role="columnheader">Disposition</b></div>{rows.map((row) => <div role="row" key={row[0]}>{row.map((cell,index)=><span role="cell" data-disposition={index===2?cell.toLowerCase():undefined} key={cell}>{cell}</span>)}</div>)}</div>;
}

export function OutcomeDivergenceFigure() {
  const metrics = ["Action success", "Reward", "Foothold spread", "Interpretation", "Objective completion"];
  return <div className="divergence-figure" role="img" aria-label="One trajectory is evaluated through five independent measures that may rank the outcome differently"><div className="divergence-source">One trajectory</div><div className="divergence-branches">{metrics.map((metric)=><div key={metric}><span aria-hidden="true">↗</span><strong>{metric}</strong></div>)}</div><p>The branches are categories, not quantities: no single measure preserved the long-horizon objective across all bounded trials.</p></div>;
}

export function RecoverableSystemsFigure() {
  return <div className="recoverable-systems-figure" role="img" aria-label="A wide interior for exploration narrows into a consequential boundary for identity, authority, evidence, and recovery"><div className="recoverable-wide"><span>Wide interior</span><strong>exploration · model freedom · cheap generation</strong></div><div className="recoverable-neck">judgment</div><div className="recoverable-boundary"><span>Narrow consequence boundary</span><strong>identity · authority · admission · evidence · recovery</strong></div><div className="recoverable-principles">{[["Thin core","lower permanent cost"],["High recoverability","make deletion cheap"],["Low governance","preserve action bandwidth"],["High potential","leave room for stronger agents"]].map(([a,b])=><div key={a}><strong>{a}</strong><span>{b}</span></div>)}</div></div>;
}
