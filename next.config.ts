import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "3000-7478235a-aa59-4311-815c-08edc6c3266e.daytonaproxy01.net",
    "192.168.1.8",
    "172.40.0.59",
    "172.40.0.57"
  ],
  devIndicators: false,
};

export default nextConfig;
