import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { execFileSync } from "node:child_process";

const withMDX = createMDX({});

function resolveBuildId() {
  const explicit = process.env.ORDIVON_BUILD_ID;
  if (explicit) return explicit;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "local";
  }
}

const config: NextConfig = {
  output: "export",
  generateBuildId: async () => resolveBuildId(),
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withMDX(config);
