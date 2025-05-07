import { apiClient } from './client';
import { ApiResponse } from './types';
import { UUID } from 'crypto';

export interface DiaryDTO {
  id: UUID;
  yyyymmdd: string;
  content: string;
  image_ids: UUID[];
}

export interface DiaryRequestDTO {
  yyyymmdd: string;
  content: string;
}

export const diaryService = {
  // 일기 작성/수정
  upsertDiary: async (date: string, content: string, images: File[]): Promise<ApiResponse<DiaryDTO>> => {
    const formData = new FormData();
    formData.append('yyyymmdd', date);
    formData.append('content', content);
    images.forEach((image) => {
      formData.append('images', image);
    });

    return apiClient.request({
      method: 'POST',
      url: '/diary',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 일기 조회
  getDiary: async (date: string): Promise<ApiResponse<DiaryDTO>> => {
    return apiClient.request({
      method: 'GET',
      url: `/diary/${date}`,
    });
  },

  // 일기 이미지 조회
  getDiaryImage: async (imageId: UUID): Promise<ApiResponse<Blob>> => {
    return apiClient.request({
      method: 'GET',
      url: `/diary/image/${imageId}`,
      responseType: 'blob',
    });
  },
}; 