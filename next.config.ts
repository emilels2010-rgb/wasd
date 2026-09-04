import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keeps the finished site compatible with GitHub Pages: no server required.
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
