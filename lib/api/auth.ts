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
}; 