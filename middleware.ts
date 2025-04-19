import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요없는 경로 목록
const publicPaths = [
  '/auth/login',
  '/auth/signup',
  '/download',
  '/'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일이나 API 경로는 건너뜁니다
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // public 경로인 경우 인증 체크를 건너뜁니다
  if (publicPaths.some(path => pathname === path || (path !== '/' && pathname.startsWith(path + '/')))) {
    return NextResponse.next();
  }

  // 쿠키에서 토큰 확인
  const token = request.cookies.get('access_token');

  // 토큰이 없는 경우 로그인 페이지로 리다이렉트
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    // 모든 경로에 대해 미들웨어를 실행
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 