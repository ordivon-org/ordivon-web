import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();
const withMDX = createMDX({});
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  reactStrictMode: true,
  redirects: async () => [
    { source: "/work", destination: "/projects", permanent: true },
    { source: "/work/:path*", destination: "/projects/:path*", permanent: true },
    { source: "/notes", destination: "/writing", permanent: true },
    { source: "/notes/:path*", destination: "/writing/:path*", permanent: true }
  ]
};
export default withMDX(nextConfig);
