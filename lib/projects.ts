export type Project = {
  slug: "computing" | "host" | "runtime" | "world";
  index: string;
  group: string;
  title: string;
  label: string;
  thesis: string;
  summary: string;
  question: string;
  state: string;
  owns: string[];
  boundary: string[];
  evidence: { value: string; label: string }[];
  openQuestions: string[];
  repository: string;
  relatedWriting: string[];
};

export const projects: Project[] = [
  {
    slug: "computing",
    index: "01",
    group: "Foundations",
    title: "Ordivon Computing",
    label: "Contracts that survive replacement",
    thesis: "Keep cognition, task continuity, semantic execution, and machine execution separable.",
    summary: "The research and conformance root for persistent work performed with probabilistic models. Computing defines the contracts that other projects test rather than becoming another production runtime.",
    question: "Which facts and contracts must remain stable when models, Hosts, tools, and execution backends change?",
    state: "Core semantic slices established; Host extracted as an independent state owner.",
    owns: ["Stack model", "Semantic contracts", "Reference systems", "Conformance"],
    boundary: ["No production Tasks", "No physical Jobs", "No implementation monorepo"],
    evidence: [
      { value: "14", label: "layer map" },
      { value: "H2–H6", label: "continuation gates" },
      { value: "2", label: "provider paths" },
    ],
    openQuestions: [
      "Which Task Runtime objects are required by asynchronous waiting and Join semantics?",
      "Which contracts survive a second independent workload without being tailored to one repository?",
    ],
    repository: "https://github.com/zycxfyh/ordivon-computing",
    relatedWriting: ["the-future-will-not-wait", "host-task-continuity", "why-ordivon"],
  },
  {
    slug: "host",
    index: "02",
    group: "Agent system",
    title: "Ordivon Host",
    label: "Task continuity above sessions",
    thesis: "Replace the model session without replacing the Task.",
    summary: "A persistent Agent control plane for Goals, Tasks, bounded cognition, candidate admission, Effect proposals, verification, and outcomes. Model sessions and Runtime processes remain replaceable dependencies.",
    question: "Which semantic state must survive when cognition, transport, and execution processes are replaced?",
    state: "Independent engineering prototype after deterministic continuation and recovery proof.",
    owns: ["Goals and Tasks", "Host journal", "Cognition contexts", "Outcomes"],
    boundary: ["No process ownership", "No model monopoly", "No Runtime mechanics"],
    evidence: [
      { value: "1", label: "append-only journal" },
      { value: "H6", label: "recovery proof" },
      { value: "UNKNOWN", label: "explicit delivery state" },
    ],
    openQuestions: [
      "Can the prototype complete a general repository Goal without absorbing Runtime mechanics?",
      "What operational surface is required before Host becomes installable rather than architectural proof?",
    ],
    repository: "https://github.com/zycxfyh/ordivon-host",
    relatedWriting: ["host-task-continuity", "runtime-after-core", "why-ordivon"],
  },
  {
    slug: "runtime",
    index: "03",
    group: "Agent system",
    title: "Ordivon Runtime",
    label: "Committed local effects",
    thesis: "Commit one Agent action to reality without losing what happened.",
    summary: "The deterministic boundary between an Agent decision and local machine execution. Runtime binds exact source and operation identity to durable Jobs, process trees, bounded evidence, cancellation, reconciliation, and recovery.",
    question: "Which execution facts cannot safely be reconstructed after interruption?",
    state: "Production Runtime with effect commitment, lifecycle operations, recovery, and receipted deployment.",
    owns: ["Workspaces", "Jobs and Attempts", "Process trees", "Artifacts"],
    boundary: ["Trusted-local, not a sandbox", "No Goal ownership", "No invented exactly-once claims"],
    evidence: [
      { value: "13", label: "public tools" },
      { value: "42", label: "Workspaces reclaimed" },
      { value: "3.4 GB", label: "post-cleanup store" },
    ],
    openQuestions: [
      "Which real structured operation can complete the full Effect contract?",
      "Which remaining friction belongs above Runtime rather than becoming another primitive?",
    ],
    repository: "https://github.com/zycxfyh/ordivon-runtime",
    relatedWriting: ["runtime-after-core", "ordivon-runtime-release", "host-task-continuity"],
  },
  {
    slug: "world",
    index: "04",
    group: "World interaction",
    title: "Ordivon World",
    label: "Conditioned external interaction",
    thesis: "Let a Task reach and act through a changing external world without rebuilding the world beneath it.",
    summary: "The Task-to-external-world interaction boundary. World correlates target, path, identity, transport, provider execution, authority, Receipt, Artifact, conditioned evidence, uncertainty, reconciliation, and rebinding while mature systems retain their native mechanisms.",
    question: "What must remain continuous when connection and external action fail together?",
    state: "Former Link and Edge histories unified; Cloudflare provider and network-observation slices preserved while the shared World Interaction boundary remains under experiment.",
    owns: ["World Interaction bindings", "Conditioned observations", "External evidence", "Reconciliation and rebinding"],
    boundary: ["No universal proxy or transport", "No provider reimplementation", "No Goal, Task, or local process ownership"],
    evidence: [
      { value: "2", label: "migrated prototype slices" },
      { value: "1", label: "correlated interaction" },
      { value: "0", label: "universal IDs" },
    ],
    openQuestions: [
      "Can one Host Task combine path evidence and provider execution, reconcile a lost response, and continue without duplicate work?",
      "Does a thin World boundary prevent a real failure better than direct Host integration?",
    ],
    repository: "https://github.com/zycxfyh/ordivon-world",
    relatedWriting: ["link-edge-boundary", "host-task-continuity", "runtime-after-core"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
