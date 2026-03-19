import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/CSxAI-PM',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
