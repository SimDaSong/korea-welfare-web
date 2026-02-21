import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['korea-welfare-mcp-server'],
  outputFileTracingIncludes: {
    '/api/chat': [
      './node_modules/korea-welfare-mcp-server/**/*',
      './node_modules/dotenv/**/*',
      './node_modules/axios/**/*',
      './node_modules/fast-xml-parser/**/*',
      './node_modules/@modelcontextprotocol/**/*',
      './node_modules/zod/**/*',
    ],
  },
};

export default nextConfig;
