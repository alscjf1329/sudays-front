export interface DiarySaveRequestDTO {
  content: string;
  images?: File[];
}

export interface DiarySaveResponseDTO {
  id: string;
  content: string;
  image_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface DiaryGetResponseDTO {
  id: string;
  content: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
} 