import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Enable server-side data persistence
  experimental: {
    serverComponentsExternalPackages: ['fs', 'path'],
  }
};

export default nextConfig;
