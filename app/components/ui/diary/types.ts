import { UUID } from 'crypto';

export const MAX_IMAGES = 5;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];

export interface ImageData {
  id: UUID;
  file: File;
  preview: string;
}

export const IMAGE_PREVIEW_SIZE = 8; 