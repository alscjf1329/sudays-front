type PopupProps = {
  title: string;
  children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({ title, children }) => {
  return (
    <div>
      <div>
        <h1>{title}</h1>
      </div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
