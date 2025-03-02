type PopupProps = {
  children: React.ReactNode;
  setIsOpen: (state: boolean) => void;
};

const LoadingBackground: React.FC<PopupProps> = ({ children, setIsOpen }) => {
  return (
    <div
      className="fixed inset-0 flex flex-col justify-center items-center bg-black/50 z-50"
      onClick={() => setIsOpen(false)}
    >
      {children}
    </div>
  );
};

export default LoadingBackground;