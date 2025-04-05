import PictureIcon from '@/app/components/ui/icons/picture-icon';
import CheckIcon from '@/app/components/ui/icons/check-icon';

interface MobileBottomBarProps {
  bottomOffset: number;
  onImageClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function MobileBottomBar({
  bottomOffset,
  onImageClick,
  onSubmit
}: MobileBottomBarProps) {
  return (
    <div
      className="md:hidden fixed left-0 right-0 bg-[var(--background-secondary)]/80 backdrop-blur-sm border-t border-[var(--border)] p-2"
      style={{
        bottom: `${bottomOffset}px`,
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex justify-between items-center p-1">
        <div
          className="cursor-pointer"
          style={{ width: '24px', height: '24px' }}
          onClick={onImageClick}
        >
          <PictureIcon />
        </div>
        <div
          className="cursor-pointer"
          style={{ width: '24px', height: '24px' }}
          onClick={onSubmit}
        >
          <CheckIcon />
        </div>
      </div>
    </div>
  );
} 