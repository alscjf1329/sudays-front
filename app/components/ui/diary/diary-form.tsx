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
import { diaryApi } from '@/app/lib/api/diary';

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
      const yyyymmdd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      try {
        const diaryData = await diaryApi.getDiary(yyyymmdd);
        
        if (diaryData) {
          setContent(diaryData.content);
          
          // 이미지 URL을 ImageData 형식으로 변환
          const images = await Promise.all(
            diaryData.image_urls.map(async (url: string) => {
              try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('이미지 로드 실패');
                const blob = await response.blob();
                const file = new File([blob], url.split('/').pop() || 'image.jpg', { type: blob.type });
                
                return {
                  id: uuidv4(),
                  file,
                  preview: url
                };
              } catch (error) {
                console.error('이미지 로드 중 오류:', error);
                return null;
              }
            })
          );
          
          setImageList(images.filter((img): img is ImageData => img !== null));
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.error('일기 데이터 조회 중 오류:', error);
          // TODO: 에러 처리 UI 추가
        }
      }
    };

    fetchDiaryData();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      content,
      images: imageList.map(img => img.file)
    });
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
          />
        </div>

        <div className="hidden md:block md:w-full">
          <button
            type="submit"
            className="w-full flex justify-center items-center p-4 rounded-lg bg-[var(--highlight-secondary)] text-white font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-highlight"
          >
            저장하기
          </button>
        </div>
      </form>

      <MobileBottomBar
        bottomOffset={bottomOffset}
        onImageClick={handleMobileImageClick}
        onSubmit={handleSubmit}
      />
    </>
  );
}
