import { apiClient } from './client';
import { ApiResponse } from './types';

export interface GetDiaryResponseDTO {
  id: string;
  yyyymmdd: string;
  content: string;
  image_ids: string[];
}

export interface SaveDiaryResponseDTO {
  id: string;
  yyyymmdd: string;
  content: string;
  image_ids: string[];
}

export const diaryService = {
  // 다이어리 조회
  getDiary: async (yyyymmdd: string): Promise<ApiResponse<GetDiaryResponseDTO>> => {
    return apiClient.request({
      method: 'GET',
      url: `/diary/${yyyymmdd}`,
    });
  },

  // 다이어리 저장/수정
  upsertDiary: async (
    yyyymmdd: string,
    content: string,
    images?: File[]
  ): Promise<ApiResponse<SaveDiaryResponseDTO>> => {
    const formData = new FormData();
    formData.append('yyyymmdd', yyyymmdd);
    formData.append('content', content);
    
    if (images && images.length > 0) {
      images.forEach((image, index) => {
        formData.append('images', image, image.name);
      });
    }

    try {
      const response = await apiClient.request<SaveDiaryResponseDTO>({
        method: 'POST',
        url: '/diary',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('다이어리 저장 중 오류:', error);
      throw error;
    }
  },

  // 다이어리 이미지 조회
  getDiaryImage: async (diaryImageId: string): Promise<ApiResponse<Blob>> => {
    return apiClient.request({
      method: 'GET',
      url: `/diary/image/${diaryImageId}`,
      responseType: 'blob',
    });
  },
}; 