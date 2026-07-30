import { articleMetadata } from "@/content/articles/registry";
import type { ArticleNode, DecisionNode, ExperimentNode, FindingNode, GraphNode, ProjectNode, QuestionNode, SystemNode } from "@/lib/graph/types";

export const graphUpdatedAt = "2026-07-30";

export const systemNodes: SystemNode[] = [
  {
    id: "system:computing", kind: "system", slug: "computing", index: "01", title: "Computing", status: "active",
    summary: "The contract and conformance layer for persistent work performed with replaceable probabilistic cognition.",
    thesis: "Keep cognition, Task continuity, semantic execution, and machine execution separable.",
    question: "Which facts and contracts must remain stable when models, Hosts, tools, and execution backends change?",
    owns: ["Stack model", "Semantic contracts", "Reference systems", "Conformance"],
    boundary: ["No production Tasks", "No physical Jobs", "No implementation monorepo"],
    href: "/projects/computing", updatedAt: graphUpdatedAt,
  },
  {
    id: "system:host", kind: "system", slug: "host", index: "02", title: "Host", status: "active",
    summary: "The semantic control plane that keeps Goals and Tasks continuous above replaceable sessions and processes.",
    thesis: "Replace the model session without replacing the Task.",
    question: "Which semantic state must survive when cognition, transport, and execution processes are replaced?",
    owns: ["Goals and Tasks", "Host journal", "Cognition contexts", "Outcomes"],
    boundary: ["No process ownership", "No model monopoly", "No Runtime mechanics"],
    href: "/projects/host", updatedAt: graphUpdatedAt,
  },
  {
    id: "system:runtime", kind: "system", slug: "runtime", index: "03", title: "Runtime", status: "active",
    summary: "The physical effect boundary that owns durable local execution identity, process state, and retained evidence.",
    thesis: "Commit one Agent action to reality without losing what happened.",
    question: "Which execution facts cannot safely be reconstructed after interruption?",
    owns: ["Workspaces", "Jobs and Attempts", "Process trees", "Artifacts"],
    boundary: ["Trusted-local, not a sandbox", "No Goal ownership", "No invented exactly-once claims"],
    href: "/projects/runtime", updatedAt: graphUpdatedAt,
  },
  {
    id: "system:world", kind: "system", slug: "world", index: "04", title: "World", status: "experimental",
    summary: "The continuity boundary for paths, identities, authority, provider actions, receipts, and external uncertainty.",
    thesis: "Let a Task reach and act through a changing external world without rebuilding the world beneath it.",
    question: "What must remain continuous when connection and external action fail together?",
    owns: ["World Interaction bindings", "Conditioned observations", "External evidence", "Reconciliation and rebinding"],
    boundary: ["No universal proxy or transport", "No provider reimplementation", "No Goal, Task, or local process ownership"],
    href: "/projects/world", updatedAt: graphUpdatedAt,
  },
];

export const projectNodes: ProjectNode[] = [
  {
    id: "project:computing", kind: "project", slug: "computing", title: "Ordivon Computing", status: "active", group: "Foundations",
    label: "Contracts that survive replacement", systemNodeId: "system:computing", publicPage: true,
    summary: "The research and conformance root for persistent work performed with probabilistic models. Computing defines the contracts that other projects test rather than becoming another production runtime.",
    state: "Core semantic slices established; Host extracted as an independent state owner.",
    evidence: [{ value: "14", label: "layer map" }, { value: "H2–H6", label: "continuation gates" }, { value: "2", label: "provider paths" }],
    repository: "https://github.com/zycxfyh/ordivon-computing", href: "/projects/computing", updatedAt: graphUpdatedAt,
  },
  {
    id: "project:host", kind: "project", slug: "host", title: "Ordivon Host", status: "active", group: "Agent system",
    label: "Task continuity above sessions", systemNodeId: "system:host", publicPage: true,
    summary: "A persistent Agent control plane for Goals, Tasks, bounded cognition, candidate admission, Effect proposals, verification, and outcomes. Model sessions and Runtime processes remain replaceable dependencies.",
    state: "Independent engineering prototype after deterministic continuation and recovery proof.",
    evidence: [{ value: "1", label: "append-only journal" }, { value: "H6", label: "recovery proof" }, { value: "UNKNOWN", label: "explicit delivery state" }],
    repository: "https://github.com/zycxfyh/ordivon-host", href: "/projects/host", updatedAt: graphUpdatedAt,
  },
  {
    id: "project:runtime", kind: "project", slug: "runtime", title: "Ordivon Runtime", status: "active", group: "Agent system",
    label: "Committed local effects", systemNodeId: "system:runtime", publicPage: true,
    summary: "The deterministic boundary between an Agent decision and local machine execution. Runtime binds exact source and operation identity to durable Jobs, process trees, bounded evidence, cancellation, reconciliation, and recovery.",
    state: "Production Runtime with effect commitment, lifecycle operations, recovery, and receipted deployment.",
    evidence: [{ value: "13", label: "public tools" }, { value: "42", label: "Workspaces reclaimed" }, { value: "3.4 GB", label: "post-cleanup store" }],
    repository: "https://github.com/zycxfyh/ordivon-runtime", href: "/projects/runtime", updatedAt: graphUpdatedAt,
  },
  {
    id: "project:world", kind: "project", slug: "world", title: "Ordivon World", status: "experimental", group: "World interaction",
    label: "Conditioned external interaction", systemNodeId: "system:world", publicPage: true,
    summary: "The Task-to-external-world interaction boundary. World correlates target, path, identity, transport, provider execution, authority, Receipt, Artifact, conditioned evidence, uncertainty, reconciliation, and rebinding while mature systems retain their native mechanisms.",
    state: "Former Link and Edge histories unified; Cloudflare provider and network-observation slices preserved while the shared World Interaction boundary remains under experiment.",
    evidence: [{ value: "2", label: "migrated prototype slices" }, { value: "1", label: "correlated interaction" }, { value: "0", label: "universal IDs" }],
    repository: "https://github.com/zycxfyh/ordivon-world", href: "/projects/world", updatedAt: graphUpdatedAt,
  },
  {
    id: "project:web", kind: "project", slug: "web", title: "Ordivon Web", status: "active", group: "Public interface",
    label: "Research as an explorable system", publicPage: false,
    summary: "The public interface that connects projects, research questions, experiments, findings, decisions, and writing without duplicating repository truth.",
    state: "Static delivery retained; /system now exposes structural, execution, and research perspectives over the shared graph.",
    evidence: [{ value: "6", label: "composable articles" }, { value: "3", label: "graph perspectives" }, { value: "1", label: "validated graph source" }],
    repository: "https://github.com/zycxfyh/ordivon-web", updatedAt: graphUpdatedAt,
  },
  {
    id: "project:game", kind: "project", slug: "game", title: "Ordivon Game", status: "experimental", group: "Agent-native application",
    label: "Games where Agents change the playable structure", publicPage: false,
    summary: "An experimental application line for mechanics that become possible when Agents can perceive, decide, persist, and act through a shared Host.",
    state: "Playable prototype work is active; public presentation remains intentionally deferred.", evidence: [],
    repository: "https://github.com/zycxfyh/ordivon-game", updatedAt: graphUpdatedAt,
  },
  {
    id: "project:security", kind: "project", slug: "security", title: "Ordivon Security", status: "experimental", group: "Adversarial agency",
    label: "Control under strategic opposition", publicPage: false,
    summary: "A research line for high-intensity adversarial agency, dynamic intent, trajectory control, and evaluation when the acting subject actively resists observation or intervention.",
    state: "Research object and repository route are being redefined before further implementation.", evidence: [],
    repository: "https://github.com/zycxfyh/ordivon-security", updatedAt: graphUpdatedAt,
  },
];

export const questionNodes: QuestionNode[] = [
  { id: "question:computing-async-join", kind: "question", title: "Which Task Runtime objects are required by asynchronous waiting and Join semantics?", summary: "Determine the smallest durable objects required when work waits, fans out, and later joins.", status: "active", state: "open", updatedAt: graphUpdatedAt },
  { id: "question:computing-second-workload", kind: "question", title: "Which contracts survive a second independent workload without being tailored to one repository?", summary: "Use an unrelated workload to distinguish general contracts from local accommodations.", status: "active", state: "testing", updatedAt: graphUpdatedAt },
  { id: "question:host-general-goal", kind: "question", title: "Can Host complete a general repository Goal without absorbing Runtime mechanics?", summary: "Test semantic continuity on real engineering work while preserving the Host–Runtime boundary.", status: "active", state: "testing", updatedAt: graphUpdatedAt },
  { id: "question:host-operational-surface", kind: "question", title: "What operational surface is required before Host becomes installable rather than architectural proof?", summary: "Identify the minimum inspect, service, backup, and recovery surface earned by real use.", status: "active", state: "open", updatedAt: graphUpdatedAt },
  { id: "question:runtime-structured-effect", kind: "question", title: "Which real structured operation can complete the full Effect contract?", summary: "Find one operation that owns canonical identity, authority, evidence, reconciliation, and ambiguity behavior.", status: "active", state: "testing", updatedAt: graphUpdatedAt },
  { id: "question:runtime-boundary-friction", kind: "question", title: "Which remaining friction belongs above Runtime rather than becoming another primitive?", summary: "Prevent workflow convenience from expanding the trusted execution kernel.", status: "active", state: "open", updatedAt: graphUpdatedAt },
  { id: "question:world-correlated-recovery", kind: "question", title: "Can one Host Task combine path evidence and provider execution, reconcile a lost response, and continue without duplicate work?", summary: "Test whether path and external action evidence can support one recoverable Task trajectory.", status: "experimental", state: "testing", updatedAt: graphUpdatedAt },
  { id: "question:world-boundary-value", kind: "question", title: "Does a thin World boundary prevent a real failure better than direct Host integration?", summary: "The project boundary must prove a concrete continuity gain before it expands.", status: "experimental", state: "open", updatedAt: graphUpdatedAt },
  { id: "question:web-research-interface", kind: "question", title: "Can the public site expose Ordivon as a changing research graph rather than a directory of pages?", summary: "Test whether graph-based navigation improves understanding and makes the system worth revisiting.", status: "active", state: "testing", updatedAt: graphUpdatedAt },
  { id: "question:game-agent-native-mechanics", kind: "question", title: "Which game structures become possible only when Agents persist and act through the same Host?", summary: "Separate genuinely Agent-native mechanics from classical systems with an LLM attached.", status: "experimental", state: "testing", updatedAt: graphUpdatedAt },
  { id: "question:security-adversarial-trajectory", kind: "question", title: "Can trajectory control remain meaningful when an Agent strategically changes behavior under observation?", summary: "Model adversarial agency beyond static permissions, policy checks, and ordinary software security.", status: "experimental", state: "open", updatedAt: graphUpdatedAt },
];

export const experimentNodes: ExperimentNode[] = [
  { id: "experiment:host-h2-h6", kind: "experiment", title: "Host deterministic continuation and restart recovery", summary: "Read, cognition, mutation, response-loss recovery, and model replacement crossed H2–H6 without moving physical process ownership into Host.", status: "historical", state: "completed", date: "2026-07-27", updatedAt: "2026-07-27" },
  { id: "experiment:runtime-production-dogfood", kind: "experiment", title: "Runtime production dogfood and lifecycle cleanup", summary: "Repeated real work exposed observation, exact request lookup, Workspace repair, lifecycle retention, and receipted deployment requirements.", status: "active", state: "completed", date: "2026-07-28", updatedAt: "2026-07-28" },
  { id: "experiment:world-unification", kind: "experiment", title: "Link and Edge boundary unification", summary: "Repository histories and proven slices were combined to test World Interaction as the continuity object rather than networking and provider action as separate projects.", status: "experimental", state: "running", date: "2026-07-30", updatedAt: graphUpdatedAt },
  { id: "experiment:web-governance-audit", kind: "experiment", title: "Web governance displacement audit", summary: "The repository was measured against its actual interface code to test whether release evidence had displaced visual and research-system work.", status: "active", state: "completed", date: "2026-07-30", updatedAt: graphUpdatedAt },
];

export const findingNodes: FindingNode[] = [
  { id: "finding:host-state-above-session", kind: "finding", title: "Task truth belongs above model sessions and execution processes", summary: "A replaceable provider can reconstruct reasoning, but it cannot safely reconstruct admitted decisions, unknown dispatches, verification, or Task outcomes.", status: "active", confidence: "strong", date: "2026-07-27", updatedAt: "2026-07-27" },
  { id: "finding:runtime-commitment-boundary", kind: "finding", title: "Commitment—not command execution—is Runtime's decisive abstraction", summary: "Request identity, source commitment, process ownership, evidence, and explicit ambiguity matter more than wrapping additional host commands.", status: "active", confidence: "strong", date: "2026-07-28", updatedAt: "2026-07-28" },
  { id: "finding:link-edge-boundary-wrong", kind: "finding", title: "Link and Edge were useful analytical planes but the wrong repository boundary", summary: "Recovery must correlate path-conditioned delivery and external execution before retry, so one World Interaction boundary better matches the continuous object.", status: "active", confidence: "supported", date: "2026-07-30", updatedAt: graphUpdatedAt },
  { id: "finding:web-governance-displaced-interface", kind: "finding", title: "Release governance had become larger than the Web interface it protected", summary: "Most tracked implementation effort lived in evidence, archives, cross-browser matrices, and release scripts while the system map remained four links and a CSS line.", status: "active", confidence: "strong", date: "2026-07-30", updatedAt: graphUpdatedAt },
];

export const decisionNodes: DecisionNode[] = [
  { id: "decision:extract-host", kind: "decision", title: "Extract Host as an independent state owner", summary: "Host now versions Task continuity independently while Computing retains shared contracts and Runtime retains physical execution truth.", status: "active", rationale: "Continuation and recovery proved a durable state boundary that would be blurred by continued incubation inside Computing.", date: "2026-07-27", updatedAt: "2026-07-27" },
  { id: "decision:unify-world", kind: "decision", title: "Unify Link and Edge under Ordivon World", summary: "Preserve their proven internal planes while removing the project boundary that split one recoverable external interaction.", status: "active", rationale: "The intended Effect conditions path choice, and response loss cannot be reconciled without delivery and execution evidence together.", date: "2026-07-30", updatedAt: graphUpdatedAt },
  { id: "decision:thin-web-release", kind: "decision", title: "Return Web release checks to build, smoke, preview, and deploy", summary: "Delete in-tree release evidence, duplicate V1 archives, browser matrices, and repeated performance proof.", status: "active", rationale: "Git-based recovery is cheaper than the governance system, and no retained gate demonstrated loss proportionate to its maintenance cost.", date: "2026-07-30", updatedAt: graphUpdatedAt },
  { id: "decision:mdx-writing", kind: "decision", title: "Replace JSON-embedded HTML with composable MDX", summary: "Articles are now real content modules that can embed research interfaces without retaining a migration pipeline.", status: "active", rationale: "The previous system paid for MDX and JSON HTML simultaneously while receiving the capabilities of neither.", date: "2026-07-30", updatedAt: graphUpdatedAt },
];

export const articleNodes: ArticleNode[] = articleMetadata.map((article) => ({
  id: `article:${article.slug}`,
  kind: "article" as const,
  slug: article.slug,
  title: article.title,
  summary: article.description,
  status: "active" as const,
  href: `/writing/${article.slug}`,
  articleType: article.type,
  project: article.project,
  date: article.date,
  updatedAt: article.modifiedDate,
}));

export const graphNodes: GraphNode[] = [
  ...systemNodes,
  ...projectNodes,
  ...questionNodes,
  ...experimentNodes,
  ...findingNodes,
  ...decisionNodes,
  ...articleNodes,
];
