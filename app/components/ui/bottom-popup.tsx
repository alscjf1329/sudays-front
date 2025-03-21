import { useState, useRef, useCallback, memo, useMemo } from 'react';

type PopupProps = {
  height: string;
  children: React.ReactNode;
  onClose?: () => void;
};

// 상수 분리
const DRAG_THRESHOLD = 100;
const ANIMATION_CONFIG = {
  duration: 300,
  easing: 'ease-out'
} as const;

// 드래그 핸들 컴포넌트 분리 및 메모이제이션
const DragHandle = memo(({ 
  onTouchStart, 
  onTouchMove, 
  onTouchEnd 
}: {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}) => (
  <div 
    className="w-full cursor-grab active:cursor-grabbing touch-none"
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}
  >
    <div className="w-full flex justify-center pt-3 pb-2">
      <div className="w-[36px] h-[5px] bg-gray-300 dark:bg-gray-600 rounded-full" />
    </div>
  </div>
));

const TopBar = memo(({ onClose }: { onClose?: () => void }) => (
  <div className="flex flex-row justify-between items-center">
    <div className="flex-1">
      <button 
        className="text-lg text-[var(--menu-color)]"
        onClick={onClose}
      >
        취소
      </button>
    </div>
  </div>
));

DragHandle.displayName = 'DragHandle';

const BottomPopup: React.FC<PopupProps> = ({ height, children, onClose }) => {
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | undefined>(undefined);

  // 드래그 핸들러 최적화
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStart === null) return;
    
    // requestAnimationFrame을 사용하여 렌더링 최적화
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      const currentY = e.touches[0].clientY;
      const diff = Math.max(0, currentY - dragStart); // Math.max로 음수 방지
      setOffsetY(diff);
    });
  }, [dragStart]);

  const handleTouchEnd = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    if (offsetY > DRAG_THRESHOLD && onClose) {
      onClose();
    } else {
      setOffsetY(0);
    }
    setDragStart(null);
  }, [offsetY, onClose]);

  // 스타일 메모이제이션
  const popupStyle = useMemo(() => ({
    height,
    maxHeight: 'calc(100vh - 50px)',
    transform: `translateY(${offsetY}px)`,
    transition: offsetY === 0 ? `transform ${ANIMATION_CONFIG.duration}ms ${ANIMATION_CONFIG.easing}` : 'none'
  }), [height, offsetY]);

  return (
    <>
      <div 
        ref={popupRef}
        className="fixed bottom-0 left-0 right-0 z-50 
          bg-white dark:bg-[#1c1c1e]
          rounded-t-[20px] shadow-lg
          will-change-transform
          overflow-hidden"
        style={popupStyle}
      >
        <DragHandle
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <div className="h-full p-4 overflow-auto overscroll-contain">
          <TopBar onClose={onClose} />
          {children}
        </div>
      </div>
    </>
  );
};

export default memo(BottomPopup);
