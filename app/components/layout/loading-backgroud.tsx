const LoadingBackground: React.FC<{ 
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
      className="fixed inset-0 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleBackgroundClick}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default LoadingBackground;