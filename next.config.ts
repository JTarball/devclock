import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/devclock" : undefined,
  assetPrefix: process.env.GITHUB_PAGES === "true" ? "/devclock/" : undefined,
};

export default nextConfig;
