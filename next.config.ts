import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ✅ allows images from ANY HTTPS domain
      },
    ],
  },
};

export default nextConfig;
