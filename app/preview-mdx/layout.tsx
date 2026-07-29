import type { Metadata } from "next";

export const metadata: Metadata = { title: "MDX proof" };

export default function MdxProofLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
