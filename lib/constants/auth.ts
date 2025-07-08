import { DIARY_ROUTES } from './routes';

// Auth Routes
export const AUTH_ROUTES = DIARY_ROUTES.AUTH;

// Auth Form Types
export const AUTH_FORM_TYPES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
} as const;

// Auth Validation Rules
export const AUTH_VALIDATION = {
  EMAIL: {
    REQUIRED: '이메일을 입력해주세요.',
    INVALID: '올바른 이메일 형식이 아닙니다.',
  },
  PASSWORD: {
    REQUIRED: '비밀번호를 입력해주세요.',
    MIN_LENGTH: '비밀번호는 8자 이상이어야 합니다.',
    MAX_LENGTH: '비밀번호는 20자 이하여야 합니다.',
  },
  CONFIRM_PASSWORD: {
    REQUIRED: '비밀번호 확인을 입력해주세요.',
    MISMATCH: '비밀번호가 일치하지 않습니다.',
  },
  NICKNAME: {
    REQUIRED: '닉네임을 입력해주세요.',
    MIN_LENGTH: '닉네임은 2자 이상이어야 합니다.',
    MAX_LENGTH: '닉네임은 10자 이하여야 합니다.',
  },
} as const;

// Auth API Endpoints
export const AUTH_API = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
} as const; 