export interface DiarySaveRequestDTO {
  content: string;
  image_url?: string;
}

export interface DiarySaveResponseDTO {
  id: string;
  content: string;
  image_url?: string;
} 