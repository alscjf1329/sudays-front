import type { NextConfig } from "next";

// 1. 플러그인 임포트 영역
const withPWA = require("next-pwa");
// 추가 플러그인들...

// 2. 플러그인 설정 영역
const pwaConfig = {
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
};

const nextConfig: NextConfig = {
  // Next.js 15.2.0 설정
  reactStrictMode: true,
  
  // turbopack 활성화 (next dev --turbopack 사용 중이므로)
  experimental: {
    turbo: {
      rules: {
        // Turbopack 규칙 설정
      }
    }
  },

  // React 19 관련 설정
  webpack: (config, { dev, isServer }) => {
    // React 19 호환성 확보
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': 'react-dom',
    }
    return config
  },

  // 리다이렉트 설정
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

// 3. 플러그인 적용 함수
const buildConfig = () => {
  let config = { ...nextConfig };
  
  // 4. 플러그인 적용 순서 관리
  config = withPWA(pwaConfig)(config);
  // config = withPluginB(pluginBConfig)(config);
  // config = withPluginC(pluginCConfig)(config);
  
  return config;
};

module.exports = buildConfig();