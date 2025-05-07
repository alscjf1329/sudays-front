import { HamburgerIcon } from "@/app/components/ui/icons/hambuger-icon";
import { SlideBar } from "@/app/components/layout/slide-bar";
import clsx from "clsx";
import { useMediaQuery } from "@/app/hooks/use-media-query";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface MenuSlideBarProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  onHamburgerClick: () => void;
  menuItems: MenuItem[];
}

const MenuSlideBar: React.FC<MenuSlideBarProps> = ({
  isOpened,
  setIsOpened,
  onHamburgerClick,
  menuItems,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
 
  return (
    <SlideBar 
      direction="right" 
      width={isMobile ? "100%" : "20%"}
      isOpened={isOpened}
      setIsOpened={setIsOpened}
    >
      <div className="flex flex-col w-full h-full p-6">
        <div className="flex items-center justify-between mb-8 border-b border-[var(--border)] pb-4">
          <div className="text-2xl font-bold text-[var(--foreground)]">메뉴</div>
          <div 
            className={clsx(    
              "w-6 h-6 flex items-center justify-center rounded-lg",
              "transition-colors duration-200",
              "hover:bg-[var(--hover)]",
              "cursor-pointer"
            )}
            onClick={onHamburgerClick}
          >
            <HamburgerIcon />
          </div>
        </div>
        <div className="flex-1">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={clsx(
                  "flex items-center p-3 rounded-lg",
                  "transition-colors duration-200",
                  "hover:bg-[var(--hover)]",
                  "cursor-pointer"
                )}
                onClick={item.onClick}
              >
                <div className="w-6 h-6 mr-3">
                  {item.icon}
                </div>
                <span className="text-lg">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideBar>
  );
};

export default MenuSlideBar; 