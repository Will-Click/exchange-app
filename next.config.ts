import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nearly every page depends on the signed-in user, so pages render per request.
  // Cache Components can be adopted later route by route.
  cacheComponents: false,
  // Hide the floating dev-mode badge so screenshots and demo recordings stay clean.
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
