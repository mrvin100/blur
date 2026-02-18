import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16+: prefer remotePatterns over images.domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
