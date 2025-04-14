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
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            // 401 에러 발생 시 리프레시 토큰으로 액세스 토큰 갱신 시도
            // 리프레시 토큰은 httpOnly 쿠키에 있으므로 자동으로 전송됨
            const response = await this.client.post<TokenResponseDTO>('/auth/refresh');
            
            if (response.data && response.headers.authorization) {
              const newToken = response.headers.authorization.replace('Bearer ', '');
              this.setAccessToken(newToken);
              // 원래 요청 재시도
              error.config.headers['Authorization'] = `Bearer ${newToken}`;
              return this.client(error.config);
            }
          } catch (refreshError) {
            // 리프레시 토큰 갱신 실패 시 로그아웃 처리
            this.clearTokens();
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );

    // 요청 인터셉터 - 모든 요청에 토큰 추가
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // 토큰 관련 메서드들
  public setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public clearTokens(): void {
    localStorage.removeItem('accessToken');
    // 리프레시 토큰은 서버에서 httpOnly 쿠키로 관리되므로 
    // 로그아웃 API 호출 시 서버에서 삭제
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      console.log('백엔드 응답:', error.response?.data);
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