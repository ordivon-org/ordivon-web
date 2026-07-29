import createMDX from "@next/mdx";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();
const withMDX = createMDX({});
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  reactStrictMode: true,
  redirects: async () => [
    { source: "/work", destination: "/projects", permanent: true },
    { source: "/notes", destination: "/writing", permanent: true }
  ]
};
export default withMDX(nextConfig);
