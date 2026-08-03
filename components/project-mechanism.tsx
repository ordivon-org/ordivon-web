import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";

function Computing() {
  return <div className="mechanism computing-model"><span>Question</span><span>Strong baseline</span><span>Experiment</span><span>Disposition</span><span>Protocol</span><span>Conformance</span></div>;
}
function Host() {
  return <div className="mechanism host-model"><div><span>01</span><strong>Task</strong><small>durable intent</small></div><i>→</i><div><span>02</span><strong>Commitment</strong><small>admitted work</small></div><i>→</i><div><span>03</span><strong>Verification</strong><small>evidence checked</small></div><i>→</i><div><span>04</span><strong>Outcome</strong><small>Task advances</small></div></div>;
}
function Harness() {
  return <div className="mechanism host-model"><div><span>01</span><strong>Assignment</strong><small>exact authority</small></div><i>→</i><div><span>02</span><strong>Model</strong><small>Provider-faithful call</small></div><i>→</i><div><span>03</span><strong>Tool step</strong><small>checkpoint + observation</small></div><i>→</i><div><span>04</span><strong>Run result</strong><small>proposal, not truth</small></div></div>;
}
function Runtime() {
  return <div className="mechanism runtime-model"><div><span>admission</span><b>exact request</b></div><div><span>dispatch</span><b>physical boundary</b></div><div><span>evidence</span><b>retained facts</b></div><div><span>reconcile</span><b>no blind replay</b></div></div>;
}
function World() {
  return <div className="mechanism world-model"><div><span>01</span><b>Cloudflare</b><small>Fetch + Browser</small></div><div><span>02</span><b>R2</b><small>private artifacts</small></div><div><span>03</span><b>Receipts</b><small>provider-native truth</small></div><div><span>04</span><b>Release</b><small>rollback + GC</small></div><div><span>05</span><b>Network</b><small>private operator tools</small></div><div><span>06</span><b>No layer</b><small>shared authority rejected</small></div></div>;
}
function Generic({ project }: { project: Project }) {
  return <div className="mechanism world-model">{project.owns.slice(0, 6).map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><small>{project.availability}</small></div>)}</div>;
}

export function ProjectMechanism({ project }: { project: Project }) {
  let model: ReactNode = <Generic project={project} />;
  if (project.slug === "computing") model = <Computing />;
  if (project.slug === "host") model = <Host />;
  if (project.slug === "harness") model = <Harness />;
  if (project.slug === "runtime") model = <Runtime />;
  if (project.slug === "world") model = <World />;
  return <div className={`project-mechanism ${project.slug}`}><p>Current operating model</p>{model}</div>;
}
