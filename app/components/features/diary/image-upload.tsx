'use client';

import { ImageData, MAX_IMAGES } from "@/app/components/features/diary/types";

interface ImageUploadProps {
  imageList: ImageData[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({
  imageList,
  handleImageChange
}: ImageUploadProps) {
  return (
    <div className="relative">
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageChange}
        multiple
        disabled={imageList.length >= MAX_IMAGES}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
      />
      <div className="w-full p-2 rounded-lg border border-[var(--border)] flex items-center">
        <span className="bg-highlight text-foreground py-2 px-4 rounded-lg mr-4 text-sm font-medium">
          사진 추가하기
        </span>
        <span className="text-muted text-sm">
          {imageList.length}장 / {MAX_IMAGES}장
        </span>
      </div>
    </div>
  );
} 