import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig, ApiError, ApiResponse } from './types';

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers,
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
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || '알 수 없는 오류가 발생했습니다.',
        code: error.response?.data?.code || 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
        details: error.response?.data?.details,
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
      };
    } catch (error) {
      throw this.handleError(error);
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