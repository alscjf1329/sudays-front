import { ThemeSwitcher } from "../ui/theme-switcher";
import { TopBar, TopBarContainer } from "./tob-bar";

type MobileLayoutProps = {
  children: React.ReactNode;
};

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen h-full">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
  
export { MobileLayout };
