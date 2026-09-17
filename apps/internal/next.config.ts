import type { NextConfig } from "next";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf-8"));

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@systrol/types"],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
      ".cjs": [".cts", ".cjs"],
    };
    return config;
  },
  env: {
    API_URL: process.env.API_URL || "https://systrol-api.onrender.com",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com",
    NEXT_PUBLIC_APP_VERSION: `v${pkg.version}`,
  },
};

export default nextConfig;
