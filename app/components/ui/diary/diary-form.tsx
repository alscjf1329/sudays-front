'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import ImageList from "@/app/components/ui/diary/image-list";
import ImageUpload from "@/app/components/ui/diary/image-upload";
import { ImageData, MAX_IMAGES } from "@/app/components/ui/diary/types";
import MobileBottomBar from './mobile-bottom-bar';
import { diaryService } from '@/app/lib/api/diary';
import { UUID } from 'crypto';

interface DiaryFormProps {
  date: Date;
  onSubmit: (data: {
    content: string;
    images: File[];
  }) => void;
}

export default function DiaryForm({ date, onSubmit }: DiaryFormProps) {
  const [content, setContent] = useState('');
  const [imageList, setImageList] = useState<ImageData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5
      }
    })
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const onViewportChange = () => {
      const heightDiff = window.innerHeight - (window.visualViewport?.height ?? 0);
      setBottomOffset(heightDiff > 0 ? heightDiff : 0);
    };

    window.visualViewport.addEventListener('resize', onViewportChange);
    window.visualViewport.addEventListener('scroll', onViewportChange);

    onViewportChange();

    return () => {
      window.visualViewport?.removeEventListener('resize', onViewportChange);
      window.visualViewport?.removeEventListener('scroll', onViewportChange);
    };
  }, []);

  useEffect(() => {
    const fetchDiaryData = async () => {
      setIsLoading(true);
      setError(null);

      const yyyymmdd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      
      try {
        const diaryData = await diaryService.getDiary(yyyymmdd);

        if (diaryData.data) {
          setContent(diaryData.data.content);

          // 이미지 ID를 사용하여 API를 통해 이미지 데이터 가져오기
          const imagePromises = diaryData.data.image_ids.map(async (imageId: string) => {
            try {
              const blob = await diaryService.getDiaryImage(imageId);
              const file = new File([blob.data], `image-${imageId}.jpg`, { type: blob.data.type });
              const previewUrl = URL.createObjectURL(blob.data);

              return {
                id: uuidv4(),
                file,
                preview: previewUrl
              };
            } catch (error) {
              console.error('이미지 로드 중 오류:', error);
              return null;
            }
          });

          const images = await Promise.all(imagePromises);
          const validImages = images.filter((img): img is ImageData => img !== null);

          setImageList(prev => {
            prev.forEach(img => URL.revokeObjectURL(img.preview));
            return validImages;
          });
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          setError('인증이 필요합니다. 로그인 페이지로 이동합니다.');
          window.location.href = '/auth/login';
        } else if (error.response?.status !== 404) {
          setError('일기 데이터 조회 중 오류가 발생했습니다.');
          console.error('일기 데이터 조회 중 오류:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaryData();

    // 컴포넌트 언마운트 시 이미지 URL 해제
    return () => {
      imageList.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [date]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_IMAGES - imageList.length;

    if (files.length === 0 || remainingSlots <= 0) return;

    const allowedFiles = files.slice(0, remainingSlots);

    const newImages = await Promise.all(
      allowedFiles.map(file => {
        return new Promise<ImageData>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: uuidv4(),
              file,
              preview: reader.result as string
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setImageList(prev => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleMobileImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
      handleImageChange(event);
    };
    input.click();
  };

  const handleRemoveImage = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setImageList(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 날짜를 YYYYMMDD 형식으로 생성
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const yyyymmdd = `${year}${month}${day}`;
      
      const files = imageList.map(img => img.file);
      
      const response = await diaryService.upsertDiary(yyyymmdd, content, files);
      
      // API 호출이 성공한 후에만 onSubmit 호출
      if (response) {
        onSubmit({
          content,
          images: files
        });
      }
    } catch (error: any) {
      setError('일기 저장 중 오류가 발생했습니다.');
      console.error('일기 저장 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    document.body.style.overflow = 'hidden';
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = imageList.findIndex(item => item.id === active.id);
      const newIndex = imageList.findIndex(item => item.id === over.id);

      setImageList(items => arrayMove(items, oldIndex, newIndex));
    }
    setActiveId(null);
    document.body.style.overflow = '';
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col p-2 gap-4 overflow-y-auto relative pb-20"
      >
        {error && (
          <div className="text-red-500 text-sm mb-2">
            {error}
          </div>
        )}
        
        <div className="w-full">
          <div className="w-full">
            <div className="hidden md:block">
              <ImageUpload
                imageList={imageList}
                handleImageChange={handleImageChange}
              />
            </div>
            <div className="mt-4 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-[var(--background-secondary)]">
              <ImageList
                imageList={imageList}
                handleRemoveImage={handleRemoveImage}
                sensors={sensors}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                activeId={activeId}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex-1">
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100%-2rem)] p-2 rounded-lg focus:outline-none placeholder:text-gray-400 resize-none"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="일상을 기록해보세요."
            disabled={isLoading}
          />
        </div>

        <div className="hidden md:block md:w-full">
          <button
            type="submit"
            className="w-full flex justify-center items-center p-4 rounded-lg bg-[var(--highlight-secondary)] text-white font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-highlight disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>

      <MobileBottomBar
        bottomOffset={bottomOffset}
        onImageClick={handleMobileImageClick}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
