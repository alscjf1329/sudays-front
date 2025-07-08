// Diary PWA Routes
export const DIARY_ROUTES = {
  ROOT: '/diary',
  AUTH: {
    LOGIN: '/diary/auth/login',
    SIGNUP: '/diary/auth/signup',
  },
  YEAR: (year: string) => `/diary/${year}`,
  MONTH: (year: string, month: string) => `/diary/${year}/${month}`,
} as const;

// Main App Routes
export const MAIN_ROUTES = {
  ROOT: '/',
  DOWNLOAD: '/download',
  MAIN: '/main',
} as const;

// All Routes
export const ROUTES = {
  DIARY: DIARY_ROUTES,
  MAIN: MAIN_ROUTES,
} as const; 