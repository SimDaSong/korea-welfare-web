import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['korea-welfare-mcp-server'],
  outputFileTracingIncludes: {
    '/api/chat': ['./node_modules/korea-welfare-mcp-server/**/*'],
  },
};

export default nextConfig;
