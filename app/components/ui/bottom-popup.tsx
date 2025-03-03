type PopupProps = {
  height: string;
  children: React.ReactNode;
};

const BottomPopup: React.FC<PopupProps> = ({ height, children }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-[10px] shadow-lg"
      style={{
        height: height,
      }}>
      {children}
    </div>
  );
};

export default BottomPopup;
