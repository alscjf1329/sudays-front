import pkg from 'next';
const { NextConfig } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. 플러그인 임포트 영역
import withPWA from "next-pwa";

// 2. Diary PWA 설정
const diaryPWAConfig = {
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: '/diary/sw.js',
  scope: '/diary',
  // 아래는 모두 삭제!
  // name: 'SUDAYS Diary',
  // short_name: 'SUDAYS',
  // description: 'SUDAYS 일기 앱 - 인증 포함',
  // theme_color: '#000000',
  // background_color: '#ffffff',
  // display: 'standalone',
  // orientation: 'portrait',
  // icons: [ ... ]
};

const config = {
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

// 3. Diary PWA 플러그인 적용
const buildConfig = () => {
  let finalConfig = { ...config };
  
  // Diary PWA 플러그인 적용
  finalConfig = withPWA(diaryPWAConfig)(finalConfig);
  
  return finalConfig;
};

export default buildConfig(); 