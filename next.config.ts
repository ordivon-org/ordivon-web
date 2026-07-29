import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({});
const config: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default withMDX(config);
