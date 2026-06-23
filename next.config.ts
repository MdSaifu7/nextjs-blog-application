import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Replace with your image base URL domain
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",

        hostname: "hip-starling-920.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "next-basilisk-909.convex.cloud", // ← Fix this
      },
      {
        protocol: "https",

        hostname: "next-basilisk-909.convex.site",
      },
      {
        protocol: "https",

        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
