import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configure image optimization
    formats: ["image/webp"], // Prefer WebP format for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Image sizes for srcset
    minimumCacheTTL: 60, // Cache optimized images for 60 seconds
    dangerouslyAllowSVG: true, // Allow SVG images
    contentDispositionType: "attachment", // Set content-disposition header
    remotePatterns: [], // No remote images in this project
    // Use sharp for better image optimization
    loader: "default",
    loaderFile: "",
    disableStaticImages: false,
    domains: [],
    path: "/_next/image",
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Disable Next.js dev tools
  devIndicators: false,
};

export default nextConfig;
