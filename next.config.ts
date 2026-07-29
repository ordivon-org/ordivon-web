import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
const withMDX = createMDX({});
const redirects = [
  ["/work", "/projects"], ["/work/computing", "/projects/computing"], ["/work/ordivon-host", "/projects/host"],
  ["/work/ordivon-runtime", "/projects/runtime"], ["/work/ordivon-link", "/projects/link"], ["/work/ordivon-edge", "/projects/edge"],
  ["/work/ordivon-web", "/colophon"], ["/notes", "/writing"], ["/contact", "/about"],
  ["/notes/host-task-continuity", "/writing/host-task-continuity"], ["/notes/link-edge-boundary", "/writing/link-edge-boundary"],
  ["/notes/ordivon-runtime-release", "/writing/ordivon-runtime-release"], ["/notes/runtime-after-core", "/writing/runtime-after-core"],
  ["/notes/the-future-will-not-wait", "/writing/the-future-will-not-wait"], ["/notes/why-ordivon", "/writing/why-ordivon"],
] as const;
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"], poweredByHeader: false, allowedDevOrigins: ["127.0.0.1", "localhost"], reactStrictMode: true,
  redirects: async () => redirects.map(([source, destination]) => ({ source, destination, permanent: true })),
};
export default withMDX(nextConfig);
