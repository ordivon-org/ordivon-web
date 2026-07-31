import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import { ClaimBoundary, InBrief, PublicationFigure } from "@/components/mdx/publication-primitives";
import { CoreDispositionFigure, OutcomeDivergenceFigure, RecoverableSystemsFigure, ReplacementFigure, TokensToWorkFigure } from "@/components/mdx/publication-figures";

function MdxLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { a: MdxLink, ClaimBoundary, InBrief, PublicationFigure, CoreDispositionFigure, OutcomeDivergenceFigure, RecoverableSystemsFigure, ReplacementFigure, TokensToWorkFigure, ...components };
}
