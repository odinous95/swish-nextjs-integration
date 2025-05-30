import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        // optionally specify pathname if needed, e.g. '/**'
        // pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "mpc.getswish.net",
        // pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
