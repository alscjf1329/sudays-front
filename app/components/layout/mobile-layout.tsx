import { ThemeSwitcher } from "../ui/theme-switcher";
import { TopBar, TopBarContainer } from "./tob-bar";

type MobileLayoutProps = {
  children: React.ReactNode;
};

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full">
      <TopBar>
        <ThemeSwitcher />
      </TopBar>
      <TopBarContainer />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};
  
export { MobileLayout };
