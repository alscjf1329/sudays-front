'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Label, Input } from '@/app/components/ui/default';
import { authService } from '@/lib/api/auth';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login({ email, password });

      if (response.status === 200) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Card className="w-full backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg rounded-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">로그인</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-300">
          계정이 없으신가요?{' '}
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            회원가입
          </Link>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} name="loginForm">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">이메일</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button
            content="로그인"
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          />
        </CardFooter>
      </form>
    </Card>
  );
} 