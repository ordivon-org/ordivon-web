declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { ArticleSourceMetadata } from "@/content/articles/schema";
  export const metadata: ArticleSourceMetadata;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
