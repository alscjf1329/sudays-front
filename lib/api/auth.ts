import { apiClient } from './client';
import { ApiResponse } from './types';

export interface TokenDTO {
  access_token: string;
  token_type: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  access_token: string;
  token_type: string;
}

export interface SignupRequestDTO {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponseDTO {
  id: string;
  email: string;
  nickname: string;
  role: string;
  created_at: string;
  updated_at: string | null;
}

export interface MemberDTO {
  id: string;
  email: string;
  nickname: string;
  role: string;
  created_at: string;
  updated_at: string | null;
}

// 이메일 인증 관련 DTO
export interface SendVerificationCodeRequestDTO {
  email: string;
}

export interface SendVerificationCodeResponseDTO {
  message: string;
  email: string;
}

export interface VerifyCodeRequestDTO {
  email: string;
  verification_code: string;
}

export interface VerifyCodeResponseDTO {
  message: string;
  is_verified: boolean;
  email: string;
}

export const authService = {
  // 로그인
  login: async (data: LoginRequestDTO): Promise<ApiResponse<LoginResponseDTO>> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    return apiClient.request({
      method: 'POST',
      url: '/auth/login',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 회원가입
  signup: async (data: SignupRequestDTO): Promise<ApiResponse<SignupResponseDTO>> => {
    return apiClient.request({
      method: 'POST',
      url: '/auth/signup',
      data,
    });
  },

  // 토큰 갱신
  refreshToken: async (): Promise<ApiResponse<TokenDTO>> => {
    return apiClient.request({
      method: 'POST',
      url: '/auth/refresh',
    });
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.request({
      method: 'POST',
      url: '/auth/logout',
    });
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<ApiResponse<MemberDTO>> => {
    return apiClient.request({
      method: 'GET',
      url: '/auth/me',
    });
  },

  // 이메일 인증코드 발송
  sendVerificationCode: async (data: SendVerificationCodeRequestDTO): Promise<ApiResponse<SendVerificationCodeResponseDTO>> => {
    return apiClient.request({
      method: 'POST',
      url: '/email/send-verification',
      data,
    });
  },

  // 이메일 인증코드 검증
  verifyCode: async (data: VerifyCodeRequestDTO): Promise<ApiResponse<VerifyCodeResponseDTO>> => {
    return apiClient.request({
      method: 'POST',
      url: '/email/verify-code',
      data,
    });
  },

  // 이메일 인증 상태 확인
  checkVerificationStatus: async (email: string): Promise<ApiResponse<{ email: string; is_verified: boolean; checked_at: string }>> => {
    return apiClient.request({
      method: 'GET',
      url: `/email/verification-status/${email}`,
    });
  },
}; 