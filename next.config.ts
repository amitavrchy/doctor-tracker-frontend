import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: { position: "bottom-right" },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${(process.env.BACKEND_API_URL || "http://localhost:5000/api").replace(/\/$/, "")}/:path*`,
      },
    ];
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};
export default nextConfig;
