import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@bubblewrap/core', 'jimp', 'sharp', '@resvg/resvg-js'],
};

export default nextConfig;
