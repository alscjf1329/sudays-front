import clsx from 'clsx';
import { useEffect, useState } from 'react';

export type SlideBarDirection = 'left' | 'right';

type SlideBarProps = {
  direction: SlideBarDirection;
  children: React.ReactNode;
};

const SlideBar: React.FC<SlideBarProps> = ({ direction, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const translateClass = direction === 'right'
    ? `translate-x-${isVisible ? '0' : 'full'}`
    : `translate-x-${isVisible ? '0' : '-full'}`;

  return (
    <div className={clsx(
      "fixed bottom-0 h-screen w-[60%] bg-[var(--background-secondary)]/80 backdrop-blur-sm flex items-center justify-between px-4 z-50",
      direction === 'left' ? 'left-0' : 'right-0',
      'transition-transform duration-500 ease-in-out transform',
      translateClass
    )}>
      {children}
    </div>
  );
};

export { SlideBar };
