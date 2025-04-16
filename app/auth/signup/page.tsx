'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Label, Input } from '@/app/components/ui/default';
import { authService } from '@/app/lib/api/auth';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await authService.signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.name
      });
      
      if (response.status === 201) {
        router.push('/auth/login');
      }
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--secondary)] to-[var(--background)]">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">SUDAYS</h1>
          <p className="text-[var(--muted)]">일정을 쉽게 관리하세요</p>
        </div>
        <Card className="w-full backdrop-blur-lg bg-[var(--background-secondary)]/80 border-[var(--border)] shadow-lg rounded-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-center text-[var(--foreground)]">회원가입</CardTitle>
            </div>
            <CardDescription className="text-center text-[var(--muted)]">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="text-[var(--primary)] hover:underline">
                로그인
              </Link>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[var(--foreground)]">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--foreground)]">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[var(--foreground)]">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
              {error && <p className="text-[var(--highlight)] text-sm">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button 
                content="회원가입" 
                type="submit" 
                className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--primary)] text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
