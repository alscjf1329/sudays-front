'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CardDescription, Input, Label, Button } from '@/app/components/common/default';
import { AUTH_ROUTES } from '@/lib/constants';
import CardPopUp from '@/app/components/popup/card-popup';
import { authService } from '@/lib/api/auth';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
  });
  const [emailCode, setEmailCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    { label: '1', title: '아이디/비번' },
    { label: '2', title: '닉네임/이메일' },
  ];

  // 이메일 인증코드 발송
  const sendVerificationCode = async (email: string) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await authService.sendVerificationCode({ email });

      setIsCodeSent(true);
      setError('');
      console.log('인증코드 발송 성공:', response.data.message);
    } catch (error: any) {
      console.error('인증코드 발송 오류:', error);
      setError(error.message || '인증코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 검증
  const verifyCode = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await authService.verifyCode({ email, verification_code: code });

      setIsCodeVerified(true);
      setError('');
      console.log('인증코드 검증 성공:', response.data.message);
      return true;
    } catch (error: any) {
      console.error('인증코드 검증 오류:', error);
      setError(error.message || '인증코드가 올바르지 않습니다.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입
  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await authService.signup({
        email: userData.email,
        password: userData.password,
        nickname: userData.nickname,
      });

      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다!');
      router.push(AUTH_ROUTES.LOGIN);
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      setError(error.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1단계: 아이디/비번
  const idPwStep = () => (
    <CardPopUp title="회원가입" subtitle={<StepIndicator step={step} setStep={setStep} steps={steps} />}>
      <CardDescription className="text-center text-[var(--secondary)] mb-4">
        이미 계정이 있으신가요?{' '}
        <Link href={AUTH_ROUTES.LOGIN} className="text-[var(--primary)] hover:underline">
          로그인
        </Link>
      </CardDescription>
      <div className="min-h-[340px] w-full max-w-[420px] flex flex-col justify-center">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (!formData.username || !formData.password || !formData.confirmPassword) {
              setError('모든 항목을 입력하세요.');
              return;
            }
            if (formData.password !== formData.confirmPassword) {
              setError('비밀번호가 일치하지 않습니다.');
              return;
            }
            setError('');
            setStep(2);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[var(--foreground)]">아이디</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={e => setFormData(f => ({ ...f, username: e.target.value }))}
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
              value={formData.password}
              onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
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
              value={formData.confirmPassword}
              onChange={e => setFormData(f => ({ ...f, confirmPassword: e.target.value }))}
              required
              className="bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--primary)] text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            content="다음"
          />
          {error && <p className="text-[var(--highlight)] text-sm mt-2">{error}</p>}
        </form>
      </div>
    </CardPopUp>
  );

  // 2단계: 닉네임+이메일+이메일인증
  const nicknameEmailStep = () => (
    <CardPopUp title="회원가입" subtitle={<StepIndicator step={step} setStep={setStep} steps={steps} />}>
      <CardDescription className="text-center text-[var(--secondary)] mb-4">
        이미 계정이 있으신가요?{' '}
        <Link href={AUTH_ROUTES.LOGIN} className="text-[var(--primary)] hover:underline">
          로그인
        </Link>
      </CardDescription>
      <div className="min-h-[340px] w-full max-w-[420px] flex flex-col justify-center">
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (!formData.nickname) {
              setError('닉네임을 입력하세요.');
              return;
            }
            if (!formData.email) {
              setError('이메일을 입력하세요.');
              return;
            }
            if (!isCodeSent) {
              setError('이메일 인증을 먼저 해주세요.');
              return;
            }
            if (!emailCode) {
              setError('인증코드를 입력하세요.');
              return;
            }
            if (!isCodeVerified) {
              setError('인증코드를 검증해주세요.');
              return;
            }

            // 회원가입 진행
            await signup(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-[var(--foreground)]">닉네임</Label>
            <Input
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={e => setFormData(f => ({ ...f, nickname: e.target.value }))}
              required
              className="bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--foreground)]">이메일</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                required
                className="flex-1 bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
              />
              <Button
                type="button"
                className={`bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white rounded-xl px-4 py-2 font-medium shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                content={isLoading ? "발송중..." : "인증"}
                onClick={() => {
                  if (isLoading) return;
                  if (!formData.email) {
                    setError('이메일을 입력하세요.');
                    return;
                  }
                  sendVerificationCode(formData.email);
                }}
              />
            </div>
          </div>
          {isCodeSent && (
            <div className="space-y-2">
              <Label htmlFor="emailCode" className="text-[var(--foreground)]">인증코드</Label>
              <div className="flex gap-2">
                <Input
                  id="emailCode"
                  name="emailCode"
                  value={emailCode}
                  onChange={e => setEmailCode(e.target.value)}
                  required
                  className="flex-1 bg-[var(--background)]/50 text-[var(--foreground)] border-[var(--border)] rounded-xl focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="6자리 숫자 입력"
                />
                <Button
                  type="button"
                  className={`bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] text-white rounded-xl px-4 py-2 font-medium shadow-lg ${(isLoading || !emailCode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  content={isLoading ? "검증중..." : "확인"}
                  onClick={async () => {
                    if (isLoading || !emailCode) return;
                    const verified = await verifyCode(formData.email, emailCode);
                    if (verified) {
                      setError('');
                    }
                  }}
                />
              </div>
              {isCodeVerified && (
                <p className="text-green-500 text-sm">✅ 이메일 인증이 완료되었습니다.</p>
              )}
            </div>
          )}
          <Button
            type="submit"
            className={`w-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--primary)] text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${(isLoading || !isCodeVerified) ? 'opacity-50 cursor-not-allowed' : ''}`}
            content={isLoading ? "처리중..." : "회원가입"}
          />
          {error && <p className="text-[var(--highlight)] text-sm mt-2">{error}</p>}
        </form>
      </div>
    </CardPopUp>
  );

  // StepIndicator 컴포넌트 타입 명시
  interface Step {
    label: string;
    title: string;
  }
  interface StepIndicatorProps {
    step: number;
    setStep: (step: number) => void;
    steps: Step[];
  }
  function StepIndicator({ step, setStep, steps }: StepIndicatorProps) {
    return (
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        {steps.map((s: Step, idx: number) => {
          const stepNum = idx + 1;
          const isActive = step === stepNum;
          const isClickable = stepNum < step;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => isClickable && setStep(stepNum)}
              className={`
              w-8 h-8 flex items-center justify-center rounded-full border-2
              ${isActive
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--background)] text-[var(--primary)] border-[var(--border)]'}
              font-bold transition
              ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-default opacity-60'}
            `}
              aria-label={s.title}
              disabled={!isClickable}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center from-[var(--secondary)] to-[var(--background)]">
      <div className="w-full max-w-md px-4 relative">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">SUDAYS</h1>
          <p className="text-[var(--secondary)]">일정을 쉽게 관리하세요</p>
        </div>
        {step === 1 && idPwStep()}
        {step === 2 && nicknameEmailStep()}
      </div>
    </div>
  );
}
