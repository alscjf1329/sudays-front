import { ThemeSwitcher } from "../ui/theme-switcher";
import { TopBar, TopBarContainer } from "./tob-bar";

type MobileLayoutProps = {
  children: React.ReactNode;
};

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar>
        <ThemeSwitcher />
      </TopBar>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <TopBarContainer />
        {children}
      </div>
    </div>
  );
};
  
export { MobileLayout };
