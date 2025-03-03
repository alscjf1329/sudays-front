// app/components/ui/theme-switcher.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme();

  // 시스템 테마가 변경될 때마다 자동으로 테마 변경
  useEffect(() => {
    if (theme === 'system') {
      setTheme(systemTheme || 'light');
    }
  }, [systemTheme, theme, setTheme]);

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
}
