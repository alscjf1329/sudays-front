'use client';

import { useTheme } from 'next-themes';

export default function Main() {
  const { theme, systemTheme } = useTheme();

  return (
    <div>
      <h1>Main</h1> 
      <p>현재 테마: {theme}</p>
      <p>시스템 테마: {systemTheme}</p>
    </div>
  )
}
