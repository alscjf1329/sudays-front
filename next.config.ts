import { NextConfig } from 'next';
import path from 'path';

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

const config: NextConfig = {
  env: {
    API_URL: process.env.API_URL,
    // 다른 환경 변수들...
  },
  // Next.js 15.2.0 설정
  reactStrictMode: false,
  
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
    config.resolve.alias['@env'] = path.join(__dirname, 'env');
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
  let finalConfig = { ...config };
  
  // 4. 플러그인 적용 순서 관리
  finalConfig = withPWA(pwaConfig)(finalConfig);
  
  return finalConfig;
};

export default buildConfig();