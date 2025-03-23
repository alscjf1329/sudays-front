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
import SortableImage from './sortable-image';
import { ImageData, IMAGE_PREVIEW_SIZE } from './types';

interface ImageListProps {
  imageList: ImageData[];
  handleRemoveImage: (id: string, e: React.MouseEvent) => void;
  sensors: any;
  handleDragStart: (event: any) => void;
  handleDragEnd: (event: any) => void;
  activeId: string | null;
}

export default function ImageList({
  imageList,
  handleRemoveImage,
  sensors,
  handleDragStart,
  handleDragEnd,
  activeId
}: ImageListProps) {
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