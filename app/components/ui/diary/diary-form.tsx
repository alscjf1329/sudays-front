'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import XIcon from '../icons/x-icon';
import DragHandleIcon from '../icons/drag-handle-icon';
import PictureIcon from '../icons/picture-icon';
import CheckIcon from '../icons/check-icon';

interface DiaryFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    images: File[];
  }) => void;
}

interface ImageData {
  id: string;
  file: File;
  preview: string;
}

const MAX_IMAGES = 10;
const IMAGE_PREVIEW_SIZE = 8;

function SortableImage({
  image,
  handleRemove
}: {
  image: ImageData;
  handleRemove: (id: string, e: React.MouseEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: `${IMAGE_PREVIEW_SIZE}rem`,
    width: `${IMAGE_PREVIEW_SIZE}rem`,
    position: 'relative' as const
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex-shrink-0 rounded-lg overflow-hidden border border-border select-none"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 z-10 w-5 h-5 bg-gray-500 text-white rounded-full flex items-center justify-center p-1 cursor-move"
      >
        <DragHandleIcon />
      </div>

      <button
        type="button"
        onClick={(e) => handleRemove(image.id, e)}
        className="absolute right-1 top-1 z-10 bg-[var(--highlight)] text-white rounded-full w-5 h-5 flex items-center justify-center p-1"
      >
        <XIcon />
      </button>

      <div className="relative w-full h-full pointer-events-none">
        <Image
          src={image.preview}
          alt="미리보기"
          fill
          className="object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
}

function ImageList({
  imageList,
  handleRemoveImage,
  sensors,
  handleDragStart,
  handleDragEnd,
  activeId
}: {
  imageList: ImageData[];
  handleRemoveImage: (id: string, e: React.MouseEvent) => void;
  sensors: any;
  handleDragStart: (event: any) => void;
  handleDragEnd: (event: any) => void;
  activeId: string | null;
}) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={imageList.map(item => item.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          className="flex gap-4 min-w-min pb-2"
          onTouchMove={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onScroll={(e) => e.stopPropagation()}
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          {imageList.map(image => (
            <SortableImage
              key={image.id}
              image={image}
              handleRemove={handleRemoveImage}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <div
            className="relative flex-shrink-0 rounded-lg overflow-hidden border border-border"
            style={{
              height: `${IMAGE_PREVIEW_SIZE}rem`,
              width: `${IMAGE_PREVIEW_SIZE}rem`,
              position: 'relative',
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={imageList.find(img => img.id === activeId)?.preview || ''}
                alt="미리보기"
                fill
                className="object-contain"
                draggable={false}
              />
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function ImageUpload({
  imageList,
  handleImageChange
}: {
  imageList: ImageData[];
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
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
      <div className="w-full p-2 rounded-lg border border-border flex items-center">
        <span className="bg-highlight text-white py-2 px-4 rounded-lg mr-4 text-sm font-medium">
          사진 추가하기
        </span>
        <span className="text-muted text-sm">
          {imageList.length}장 / {MAX_IMAGES}장
        </span>
      </div>
    </div>
  );
}

export default function DiaryForm({ onSubmit }: DiaryFormProps) {
  const [title, setTitle] = useState('');
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

  // ✅ visualViewport 사용해서 하단 고정바 위치 조정
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
      title,
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
        className="w-full h-full flex flex-col p-6 gap-4 overflow-y-auto relative pb-20"
      >
        <div className="w-full">
          <label htmlFor="title" className="block text-lg font-medium mb-2 text-foreground">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-highlight placeholder:text-muted"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        <div className="w-full">
          <label htmlFor="image" className="block text-lg font-medium mb-2 text-foreground">
            사진
          </label>
          <div className="w-full">
            <div className="hidden md:block">
              <ImageUpload
                imageList={imageList}
                handleImageChange={handleImageChange}
              />
            </div>
            <div className="mt-4 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
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
          <label htmlFor="content" className="block text-lg font-medium mb-2 text-foreground">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100%-2rem)] p-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-highlight placeholder:text-muted resize-none"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
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

      {/* ✅ 하단바 (fixed) - visualViewport 기반 위치 조정 */}
      <div
        className="md:hidden fixed left-0 right-0 bg-[var(--background-secondary)]/80 backdrop-blur-sm border-t border-[var(--border)] p-2"
        style={{
          bottom: `${bottomOffset}px`,
          zIndex: 50,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex justify-between items-center">
          <div className="w-8 h-8 cursor-pointer" onClick={handleMobileImageClick}>
            <PictureIcon />
          </div>
          <div className="w-8 h-8 cursor-pointer" onClick={handleSubmit}>
            <CheckIcon />
          </div>
        </div>
      </div>
    </>
  );
}
