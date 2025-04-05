import { UUID } from "crypto";

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