import type { ReactNode } from "react";

export function InBrief({ claim, evidence, scope, children }: { claim: string; evidence: string; scope: string; children?: ReactNode }) {
  return <section className="mdx-in-brief" aria-label="In brief"><div><span>Central claim</span><strong>{claim}</strong></div><div><span>Evidence</span><strong>{evidence}</strong></div><div><span>Scope</span><strong>{scope}</strong></div>{children && <div className="mdx-in-brief-context">{children}</div>}</section>;
}

export function ClaimBoundary({ observed, supports, doesNotEstablish }: { observed: readonly string[]; supports: readonly string[]; doesNotEstablish: readonly string[] }) {
  return <section className="mdx-claim-boundary" aria-label="Claim boundary"><article><span>Observed</span><ul>{observed.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>Supports</span><ul>{supports.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>Does not establish</span><ul>{doesNotEstablish.map((item) => <li key={item}>{item}</li>)}</ul></article></section>;
}

export function PublicationFigure({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return <figure className="publication-figure"><div className="publication-figure-heading"><span>Figure</span><strong>{title}</strong></div>{children}<figcaption>{caption}</figcaption></figure>;
}
