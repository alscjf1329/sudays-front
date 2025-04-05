import { UUID } from 'crypto';
import { apiClient } from './client';
import { DiarySaveRequestDTO, DiarySaveResponseDTO, DiaryGetResponseDTO, ApiResponse } from './types';

export const diaryService = {
  // 일기 저장
  upsertDiary: async (data: DiarySaveRequestDTO): Promise<ApiResponse<DiarySaveResponseDTO>> => {
    const formData = new FormData();
    formData.append('yyyymmdd', data.yyyymmdd);
    formData.append('content', data.content);

    if (data.images?.length) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }

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
  getDiary: async (yyyymmdd: string): Promise<ApiResponse<DiaryGetResponseDTO>> => {
    return apiClient.request({
      method: 'GET',
      url: `/diary/${yyyymmdd}`,
    });
  },

  // 일기 삭제
  deleteDiary: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.request({
      method: 'DELETE',
      url: `/diary/${id}`,
    });
  },

  // 일기 이미지 조회
  getDiaryImage: async (image_id: string): Promise<ApiResponse<Blob>> => {
    return apiClient.request({
      method: 'GET',
      url: `/diary/image/${image_id}`,
      responseType: 'blob',
    });
  },
}; 