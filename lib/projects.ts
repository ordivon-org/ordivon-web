export type Project = {
  slug: "computing" | "host" | "runtime" | "link" | "edge";
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
    slug: "link",
    index: "04",
    group: "World interfaces",
    title: "Ordivon Link",
    label: "Path evidence and recovery",
    thesis: "Observe and recover the path without owning the task that uses it.",
    summary: "A local connectivity and replaceable-transport layer. Link observes, probes, compares, selects, connects, verifies, and recovers network paths while remaining separate from local execution and hosted capabilities.",
    question: "Which network path is available, suitable, selected, connected, and recoverable?",
    state: "Observation, history, read-only presentation, and bounded reference transport implemented.",
    owns: ["Path observations", "Route identity", "Transport choice", "Recovery evidence"],
    boundary: ["No automatic root-route mutation", "No hosted execution", "No general control plane"],
    evidence: [
      { value: "4", label: "path states" },
      { value: "SSE", label: "read-only stream" },
      { value: "mTLS", label: "wire reference" },
    ],
    openQuestions: [
      "When should repeated evidence justify automatic failover?",
      "Which mature transport adapter deserves production integration?",
    ],
    repository: "https://github.com/zycxfyh/ordivon-link",
    relatedWriting: ["link-edge-boundary", "runtime-after-core"],
  },
  {
    slug: "edge",
    index: "05",
    group: "World interfaces",
    title: "Ordivon Edge",
    label: "Bounded hosted capabilities",
    thesis: "Execute a network-side capability without turning the edge into a proxy or scheduler.",
    summary: "A Cloudflare execution plane for signed Fetch and Browser Run operations, private Artifacts, policy budgets, fenced leases, deterministic receipts, release control, and recovery.",
    question: "Which externally hosted capability should execute one bounded task and return a receipt or Artifact?",
    state: "Fetch, Browser, Artifact, policy, idempotency, and recoverable release planes active.",
    owns: ["Hosted requests", "Fenced leases", "Private Artifacts", "Receipts"],
    boundary: ["No public proxy", "No remote shell", "No local path selection"],
    evidence: [
      { value: "90 d", label: "idempotency window" },
      { value: "R2", label: "private artifacts" },
      { value: "2", label: "bounded capabilities" },
    ],
    openQuestions: [
      "Which next capability genuinely earns its hosted boundary?",
      "Which retention and privacy rules survive more varied browser workloads?",
    ],
    repository: "https://github.com/zycxfyh/ordivon-edge",
    relatedWriting: ["link-edge-boundary", "runtime-after-core"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
