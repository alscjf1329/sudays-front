import { UUID } from "crypto";

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface DiarySaveRequestDTO {
  yyyymmdd: string;
  content: string;
  images?: File[];
}

export interface DiarySaveResponseDTO {
  id: string;
  content: string;
  image_ids?: UUID[];
  created_at: string;
  updated_at: string;
}

export interface DiaryGetResponseDTO {
  id: string;
  content: string;
  image_ids: UUID[];
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
} 