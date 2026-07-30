import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";

function Computing() {
  return <div className="mechanism computing-model"><span>Model Runtime</span><span>Agent Host</span><span>Task Runtime</span><span>Semantic Kernel</span><span>Execution Runtime</span><span>Operating System</span></div>;
}
function Host() {
  return <div className="mechanism host-model"><div><span>01</span><strong>Context</strong><small>bounded input</small></div><i>→</i><div><span>02</span><strong>Decision</strong><small>admitted candidate</small></div><i>→</i><div><span>03</span><strong>Dispatch</strong><small>correlated effect</small></div><i>→</i><div><span>04</span><strong>Outcome</strong><small>verified projection</small></div></div>;
}
function Runtime() {
  return <div className="mechanism runtime-model"><div><span>proposal</span><b>not committed</b></div><div><span>dispatch</span><b>physical boundary</b></div><div><span>evidence</span><b>retained facts</b></div><div><span>completion</span><b>separate claim</b></div></div>;
}
function World() {
  return <div className="mechanism world-model"><div><span>01</span><b>Intent</b><small>external relation</small></div><div><span>02</span><b>Observation</b><small>path + provider</small></div><div><span>03</span><b>Binding</b><small>identity + authority</small></div><div><span>04</span><b>Interaction</b><small>native mechanism</small></div><div><span>05</span><b>Evidence</b><small>Receipt + Artifact</small></div><div><span>06</span><b>Continuation</b><small>reconcile + rebind</small></div></div>;
}

export function ProjectMechanism({ project }: { project: Project }) {
  let model: ReactNode = null;
  if (project.slug === "computing") model = <Computing />;
  if (project.slug === "host") model = <Host />;
  if (project.slug === "runtime") model = <Runtime />;
  if (project.slug === "world") model = <World />;
  return <div className={`project-mechanism ${project.slug}`}><p>Working model</p>{model}</div>;
}
