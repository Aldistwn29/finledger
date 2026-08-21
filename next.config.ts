import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.VERCEL === "1" ? undefined : "standalone",
};

export default nextConfig;
