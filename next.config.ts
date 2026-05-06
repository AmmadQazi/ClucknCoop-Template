import type { NextConfig } from "next";

const imageDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS
  ? process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(",").map((h) => h.trim())
  : [];

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ClucknCoop-Template",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: imageDomains.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default nextConfig;
