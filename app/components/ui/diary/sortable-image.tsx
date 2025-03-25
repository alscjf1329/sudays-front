'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import DragHandleIcon from '../icons/drag-handle-icon';
import XIcon from '../icons/x-icon';
import { WhiteArrowLeftIcon } from '../icons/arrow-left-icon';
import LoadingLayout from '../../layout/loading-layout';
import LoadingBackground from '../../layout/loading-backgroud';
import { ImageData, IMAGE_PREVIEW_SIZE } from './types';

interface SortableImageProps {
  image: ImageData;
  handleRemove: (id: string, e: React.MouseEvent) => void;
}

export default function SortableImage({ image, handleRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: image.id });

  const [isLongPressed, setIsLongPressed] = useState(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showModal, setShowModal] = useState(false);

  const startPressTimer = () => {
    if (pressTimerRef.current) return;
    pressTimerRef.current = setTimeout(() => {
      setIsLongPressed(true);
    }, 500);
  };

  const clearPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

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
      className="relative flex-shrink-0 rounded-lg overflow-hidden border border-[var(--border)] select-none"
      onMouseDown={startPressTimer}
      onMouseUp={clearPressTimer}
      onMouseLeave={clearPressTimer}
      onTouchStart={startPressTimer}
      onTouchEnd={clearPressTimer}
      onTouchCancel={clearPressTimer}
    >
      {isLongPressed && (
        <LoadingLayout setIsOpen={() => { setIsLongPressed(false) }}>
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
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex bg-gray-500/50 w-1/2 h-1/2 rounded-full items-center justify-center p-3"
          >
            <XIcon />
          </button>
        </LoadingLayout>
      )}

      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <Image
          src={image.preview}
          alt="미리보기"
          fill
          className="object-contain"
          draggable={false}
        />
      </div>
      {showModal && createPortal(
        <LoadingBackground setIsOpen={() => setShowModal(false)}>
          <button 
            type="button" 
            className="fixed top-0 left-0 w-10 h-10 flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <WhiteArrowLeftIcon />
          </button>
          <div className="relative w-[80vw] h-[80vh] max-w-4xl max-h-[80vh]">
            <Image
              src={image.preview}
              alt="미리보기"
              fill
              className="object-contain"
              draggable={false}
            />
          </div>
        </LoadingBackground>,
        document.body
      )}
    </div>
  );
} 