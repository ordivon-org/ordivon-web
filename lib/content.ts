import type { ComponentType } from "react";
import FromTokensToWork from "@/content/articles/from-tokens-to-work.mdx";
import WhyOrdivonNeedsAHarness from "@/content/articles/why-ordivon-needs-a-harness.mdx";
import WhatH1H5Proved from "@/content/articles/what-h1-h5-proved.mdx";
import { getProjectBySlug, getQuestionBySlug } from "@/content/model";
import CreationJudgmentRecoverableSystems from "@/content/articles/creation-judgment-recoverable-systems.mdx";
import StationZeroAlpha1 from "@/content/articles/station-zero-alpha-1.mdx";
import ThinHostWithoutHiddenPlanner from "@/content/articles/thin-host-without-hidden-planner.mdx";
import OneAuthorityThirteenTables from "@/content/articles/one-authority-thirteen-tables.mdx";
import ReplayWithoutSecondTruthStore from "@/content/articles/replay-without-second-truth-store.mdx";
import TranscriptNotTaskDatabase from "@/content/articles/transcript-not-task-database.mdx";
import UnknownIsOperationalState from "@/content/articles/unknown-is-operational-state.mdx";
import CommunicationIsGameplayState from "@/content/articles/communication-is-gameplay-state.mdx";
import WinningMoveLosesContest from "@/content/articles/winning-move-loses-contest.mdx";
import SmallerCoreStrongBaselines from "@/content/articles/smaller-core-strong-baselines.mdx";
import FutureWillNotWait from "@/content/articles/the-future-will-not-wait.mdx";
import LinkEdgeBoundary from "@/content/articles/link-edge-boundary.mdx";
import RuntimeAfterCore from "@/content/articles/runtime-after-core.mdx";
import HostTaskContinuity from "@/content/articles/host-task-continuity.mdx";
import RuntimeRelease from "@/content/articles/ordivon-runtime-release.mdx";
import WhyOrdivon from "@/content/articles/why-ordivon.mdx";
import { articleMetadata, type ArticleMetadata, type ArticleSlug, type TocEntry } from "@/content/articles/registry";

export type { ArticleMetadata, ArticleSlug, TocEntry };
export type Article = ArticleMetadata & { Content: ComponentType };

const articleComponents: Record<ArticleSlug, ComponentType> = {
  "from-tokens-to-work": FromTokensToWork,
  "why-ordivon-needs-a-harness": WhyOrdivonNeedsAHarness,
  "what-h1-h5-proved": WhatH1H5Proved,
  "creation-judgment-recoverable-systems": CreationJudgmentRecoverableSystems,
  "station-zero-alpha-1": StationZeroAlpha1,
  "thin-host-without-hidden-planner": ThinHostWithoutHiddenPlanner,
  "one-authority-thirteen-tables": OneAuthorityThirteenTables,
  "replay-without-second-truth-store": ReplayWithoutSecondTruthStore,
  "transcript-not-task-database": TranscriptNotTaskDatabase,
  "unknown-is-operational-state": UnknownIsOperationalState,
  "communication-is-gameplay-state": CommunicationIsGameplayState,
  "winning-move-loses-contest": WinningMoveLosesContest,
  "smaller-core-strong-baselines": SmallerCoreStrongBaselines,
  "the-future-will-not-wait": FutureWillNotWait,
  "link-edge-boundary": LinkEdgeBoundary,
  "runtime-after-core": RuntimeAfterCore,
  "host-task-continuity": HostTaskContinuity,
  "ordivon-runtime-release": RuntimeRelease,
  "why-ordivon": WhyOrdivon,
};

export const articles: Article[] = articleMetadata.map((article) => {
  if (!articleComponents[article.slug]) throw new Error(`missing MDX component for ${article.slug}`);
  for (const slug of article.projectSlugs) if (!getProjectBySlug(slug)) throw new Error(`${article.slug} references missing project ${slug}`);
  for (const slug of article.questionSlugs) if (!getQuestionBySlug(slug)) throw new Error(`${article.slug} references missing question ${slug}`);
  return { ...article, Content: articleComponents[article.slug] };
});

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export const articleTypes = [...new Set(articles.map((article) => article.type))];
