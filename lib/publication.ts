import type { ClaimClass, EvidenceLevel } from "@/content/articles/schema";

export const evidenceLabels: Record<EvidenceLevel, string> = {
  E0: "Assertion", E1: "Reasoned argument", E2: "Observed dogfood", E3: "Bounded experiment",
  E4: "Reproducible engineering evidence", E5: "External replication or sustained operation",
};
export const claimLabels: Record<ClaimClass, string> = {
  "observed-fact": "Observed fact", "experimental-result": "Experimental result", "engineering-inference": "Engineering inference",
  "architecture-decision": "Architecture decision", thesis: "Thesis", forecast: "Forecast", aspiration: "Aspiration",
};
