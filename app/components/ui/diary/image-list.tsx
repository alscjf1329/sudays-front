'use client';

import {
  DndContext,
  closestCenter,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import Image from 'next/image';
import SortableImage from "@/app/components/ui/diary/sortable-image";
import { ImageData, IMAGE_PREVIEW_SIZE } from "@/app/components/ui/diary/types";
import { useCallback, useState } from 'react';
import { UUID } from 'crypto';

interface ImageListProps {
  imageList: ImageData[];
  handleRemoveImage: (id: UUID, e: React.MouseEvent) => void;
  sensors: any;
  handleDragStart: (event: any) => void;
  handleDragEnd: (event: any) => void;
  activeId: UUID | null;
}

export default function ImageList({
  imageList,
  handleRemoveImage,
  sensors,
  handleDragStart,
  handleDragEnd,
  activeId
}: ImageListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStart(touch.clientX);
      setTouchEnd(touch.clientX);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchEnd(e.touches[0].clientX);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < imageList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, currentIndex, imageList.length]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

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
            className="relative flex-shrink-0 rounded-lg overflow-hidden"
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