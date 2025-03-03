import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",  // 사이트 루트(`/`) 접근 시
        destination: "/download",
        permanent: false,  // 301 리다이렉트 (영구적 변경)
      },
    ];
  },
};

module.exports = withPWA(nextConfig);