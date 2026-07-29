import type { Metadata } from "next";
export const metadata: Metadata = { title: "MDX proof", robots: { index: false, follow: false } };
export default function MdxProofLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="page-shell page-top preview-proof">{children}</div>; }
