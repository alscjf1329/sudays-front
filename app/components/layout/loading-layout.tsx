const LoadingLayout: React.FC<{
  children: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}> = ({ children, setIsOpen }) => {
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm w-full h-full flex flex-col justify-center items-center z-50"
      onClick={handleBackgroundClick}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default LoadingLayout;