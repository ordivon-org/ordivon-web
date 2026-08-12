export type TocEntry = { id: string; label: string };
export type PublicationStatus = "current" | "revised" | "superseded" | "historical";
export type ClaimClass = "observed-fact" | "experimental-result" | "engineering-inference" | "architecture-decision" | "thesis" | "forecast" | "aspiration";
export type EvidenceLevel = "E0" | "E1" | "E2" | "E3" | "E4" | "E5";

export type ArticleSourceMetadata = {
  documentId?: string;
  sourceRole?: "derived";
  slug: string;
  title: string;
  deck: string;
  description: string;
  projectSlugs: readonly string[];
  questionSlugs: readonly string[];
  type: string;
  project: string;
  publishedAt: string;
  revisedAt?: string;
  readMinutes: number;
  author: string;
  lead: string;
  readerCodes?: readonly { code: string; meaning: string }[];
  status: PublicationStatus;
  claimClass: ClaimClass;
  evidenceLevel: EvidenceLevel;
  takeaways: readonly string[];
  limitations: readonly string[];
  canonicalResearchRecord?: string;
  supersedes?: string;
  supersededBy?: string;
};

export type ArticleMetadata = ArticleSourceMetadata & { toc: readonly TocEntry[] };
