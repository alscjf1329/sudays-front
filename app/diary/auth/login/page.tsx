'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Label, Input } from '@/app/components/common/default';
import { authService } from '@/lib/api/auth';
import { AUTH_ROUTES, DIARY_ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!isMounted) return;

      try {
        const response = await authService.getCurrentUser();
        if (response.status === 200) {
          router.push(DIARY_ROUTES.ROOT);
        } else {
          setIsAutoLogin(false);
        }
      } catch (error) {
        setIsAutoLogin(false);
      }
    };

    // 로그인 페이지에서만 리프레시 토큰 체크
    if (window.location.pathname === AUTH_ROUTES.LOGIN) {
      checkAuth();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });

      if (response.status === 200) {
        router.push(DIARY_ROUTES.ROOT);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isAutoLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--background-secondary)] to-[var(--background)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">SUDAYS</h1>
          <p className="text-[var(--muted)]">로그인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--background-secondary)] to-[var(--background)]">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">SUDAYS</h1>
          <p className="text-[var(--secondary)]">일정을 쉽게 관리하세요</p>
        </div>
        <Card className="w-full backdrop-blur-lg bg-[var(--background-secondary)]/80 border-[var(--border)] shadow-lg rounded-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-center text-[var(--foreground)]">로그인</CardTitle>
            </div>
            <CardDescription className="text-center text-[var(--secondary)]">
              계정이 없으신가요?{' '}
              <Link href={AUTH_ROUTES.SIGNUP} className="text-[var(--primary)] hover:underline">
                회원가입  
              </Link>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} name="loginForm">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--foreground)]">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[var(--foreground)]">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              {error && <p className="text-[var(--highlight)] text-sm">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button
                content="로그인"
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--primary)] text-[var(--background)] rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
