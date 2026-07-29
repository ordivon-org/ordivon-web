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
function Link() {
  return <div className="mechanism link-model"><div><b>Direct</b><span>available</span><small>observed</small></div><div className="selected"><b>Tokyo</b><span>selected</span><small>stable</small></div><div><b>VPN</b><span>degraded</span><small>variable</small></div><div><b>Fallback</b><span>recoverable</span><small>held</small></div></div>;
}
function Edge() {
  return <div className="mechanism edge-model"><div><span>signed request</span></div><i>→</i><div><span>fenced lease</span></div><i>→</i><div><span>bounded execution</span></div><i>→</i><div><span>receipt + artifact</span></div></div>;
}

export function ProjectMechanism({ project }: { project: Project }) {
  const models = { computing: <Computing />, host: <Host />, runtime: <Runtime />, link: <Link />, edge: <Edge /> };
  return <div className={`project-mechanism ${project.slug}`}><p>Working model</p>{models[project.slug]}</div>;
}
