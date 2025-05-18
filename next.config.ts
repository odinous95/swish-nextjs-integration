import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.ibb.co", "mpc.getswish.net"],
  },
  remotePatterns: [
    {
      protocol: "https",
      hostname: "i.ibb.co",
    },
  ],
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
