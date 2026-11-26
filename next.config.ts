import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nearly every page depends on the signed-in user, so pages render per request.
  // Cache Components can be adopted later route by route.
  cacheComponents: false,
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
