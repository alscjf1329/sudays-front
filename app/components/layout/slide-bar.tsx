import clsx from 'clsx';

export type SlideBarDirection = 'left' | 'right';

type SlideBarProps = {
  direction: SlideBarDirection;
  children: React.ReactNode;
  width: string;
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
};

const SlideBar: React.FC<SlideBarProps> = ({ 
  direction, 
  children, 
  width,
  isOpened,
  setIsOpened 
}) => {
  return (
    <div 
      className={clsx(
        'fixed top-0 h-screen bg-[var(--background-secondary)] flex items-center justify-between px-4 z-50',
        direction === 'right' ? 'right-0' : 'left-0',
        'transition-all duration-500 ease-in-out',
        isOpened ? 'translate-x-0' : direction === 'right' ? 'translate-x-full' : '-translate-x-full'
      )}
      style={{ 
        width,
        transform: isOpened ? 'translateX(0)' : direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)'
      }}
    >
      {children}
    </div>
  );
};

export { SlideBar };
