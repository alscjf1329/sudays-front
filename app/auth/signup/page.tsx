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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">SUDAYS</h1>
          <p className="text-gray-600 dark:text-gray-300">일정을 쉽게 관리하세요</p>
        </div>
        <Card className="w-full backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg rounded-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-white">회원가입</CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              이미 계정이 있으신가요?{' '}
              <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                로그인
              </Link>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={handleChange}
                  required
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button 
                content="회원가입" 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
