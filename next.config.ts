import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Freebuff preview serves the dev server through a proxy host; without
  // this, Next.js blocks cross-origin dev resources (/_next/hmr) in dev.
  allowedDevOrigins: [
    "3000-7478235a-aa59-4311-815c-08edc6c3266e.daytonaproxy01.net",
  ],
};

export default nextConfig;
