import { apiClient } from './client';
import { DiarySaveRequestDTO, DiarySaveResponseDTO, DiaryGetResponseDTO, ApiError } from './types';

export const diaryApi = {
  // 일기 저장
  saveDiary: async (data: DiarySaveRequestDTO): Promise<DiarySaveResponseDTO> => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await apiClient.post<DiarySaveResponseDTO>('/diary', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('일기 저장 중 오류 발생:', apiError.message);
      throw apiError;
    }
  },

  // 일기 조회
  getDiary: async (yyyymmdd: string): Promise<DiaryGetResponseDTO> => {
    try {
      const response = await apiClient.get<DiaryGetResponseDTO>(`/diary/${yyyymmdd}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('일기 조회 중 오류 발생:', apiError.message);
      throw apiError;
    }
  },

  // 일기 수정
  updateDiary: async (id: string, data: DiarySaveRequestDTO): Promise<DiarySaveResponseDTO> => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      
      if (data.images) {
        data.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await apiClient.put<DiarySaveResponseDTO>(`/diary/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('일기 수정 중 오류 발생:', apiError.message);
      throw apiError;
    }
  },

  // 일기 삭제
  deleteDiary: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/diary/${id}`);
    } catch (error) {
      const apiError = error as ApiError;
      console.error('일기 삭제 중 오류 발생:', apiError.message);
      throw apiError;
    }
  },
}; 