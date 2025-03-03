type PopupProps = {
  height: string;
  children: React.ReactNode;
};

const BottomPopup: React.FC<PopupProps> = ({ height, children }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        height: height,
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15), 0 -8px 24px rgba(0, 0, 0, 0.1)",
      }}>
      {children}
    </div>
  );
};

export default BottomPopup;
