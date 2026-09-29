import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // Keep static exports within the memory available on development machines.
  experimental: { cpus: 2, inlineCss: true },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
