'use client'

import { ThemeProvider } from "@/app/components/theme/theme-provider"
import { MobileLayout } from "@/app/components/layout/mobile-layout";
import { useState, useEffect } from "react";

export default function DiaryLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  // Diary PWA 서비스 워커 등록
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/diary/sw.js', { scope: '/diary/' })
        .then((registration) => {
          console.log('Diary PWA Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Diary PWA Service Worker registration failed:', error);
        });
    }
  }, []);

  if (!mounted) return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body>
        {children}
      </body>
    </html>
  );

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/diary/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/diary-icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="SUDAYS Diary" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MobileLayout>
            {children}
          </MobileLayout>
        </ThemeProvider>
      </body>
    </html>
  )
} 