import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig, ApiError, ApiResponse, TokenResponseDTO } from './types';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
      withCredentials: true // 쿠키를 주고받기 위해 필요
    });

    this.setupInterceptors();
  }

  public static getInstance(config: ApiConfig): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(config);
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // 리프레시 토큰 요청 자체가 실패한 경우
        if (originalRequest.url?.includes('/auth/refresh')) {
          this.clearTokens();
          if (!window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
          return Promise.reject(error);
        }

        // 401 에러이고, 이미 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const response = await this.client.post<TokenResponseDTO>('/auth/refresh', {}, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (response.data && response.headers.authorization) {
              const newToken = response.headers.authorization.replace('Bearer ', '');
              document.cookie = `access_token=${newToken}; path=/; secure; samesite=strict`;
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            if (!window.location.pathname.includes('/auth/login')) {
              window.location.href = '/auth/login';
            }
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );

    // 요청 인터셉터 - 모든 요청에 토큰 추가
    this.client.interceptors.request.use(
      (config) => {
        // 리프레시 토큰 요청인 경우 토큰을 추가하지 않음
        if (config.url?.includes('/auth/refresh')) {
          return config;
        }

        // 쿠키에서 토큰 가져오기
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('access_token='))
          ?.split('=')[1];

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  public clearTokens(): void {
    // 쿠키에서 토큰 삭제
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data.detail || error.message,
        code: error.code || 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
      };
    }
    return {
      message: error.message || '알 수 없는 오류가 발생했습니다.',
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  }

  public async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.client.request(config);
      
      // 토큰이 있는 경우에만 헤더에 포함
      const headers: Record<string, string> = {};
      if (response.headers.authorization) {
        headers.authorization = response.headers.authorization;
      }

      return {
        data: response.data,
        message: response.statusText,
        status: response.status,
        headers: response.headers as Record<string, string>,
      };
    } catch (error) {
      throw error;
    }
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = ApiClient.getInstance({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}); 