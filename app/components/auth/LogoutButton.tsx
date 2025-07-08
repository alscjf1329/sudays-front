'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/common/default';
import { authService } from '@/lib/api/auth';
import { DIARY_ROUTES } from '@/lib/constants/routes';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 쿠키에서 토큰 삭제
    authService.logout();
    // 로그인 페이지로 리다이렉트 
    router.push(DIARY_ROUTES.AUTH.LOGIN);
  };

  return (
    <Button
      content="로그아웃"
      type="button" 
      onClick={handleLogout}
      className="bg-[var(--highlight)] hover:bg-[var(--highlight)]/90 text-white rounded-lg px-4 py-2 transition-colors duration-200"
    />
  );
}