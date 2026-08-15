import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The PDF routes read the Cyrillic TTFs at runtime, so they must be traced
  // into the serverless bundle — nothing imports them statically.
  outputFileTracingIncludes: {
    "/api/**": ["./assets/fonts/**"],
  },
};

export default nextConfig;
