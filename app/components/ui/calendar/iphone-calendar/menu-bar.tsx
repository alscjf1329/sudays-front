import clsx from "clsx";
import { HamburgerIcon } from "@/app/components/ui/icons/hambuger-icon";
import { redirect } from "next/navigation";

interface MenuBarProps {
  currentDate: Date;
  onHamburgerClick: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ currentDate, onHamburgerClick }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="text-lg font-medium">
        {currentDate.getFullYear()}년
      </div>
      <div
        className={clsx(
          "w-8 h-8 flex items-center justify-center rounded-lg",
          "transition-colors duration-200",
          "hover:bg-[var(--hover)]",
          "cursor-pointer"
        )}
        onClick={onHamburgerClick}
      >
        <HamburgerIcon />
      </div>
    </div>
  );
};

const MenuShowIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="w-5 h-5 text-foreground/80 flex items-center justify-center" onClick={onClick}>
      <img
        src="/icons/menu-show.png"
        alt="menu-show" className="w-full" />
    </div>
  );
};

const SearchIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="w-5 h-5 text-foreground/80 flex items-center justify-center" onClick={onClick}>
      <img
        src="/icons/menu-search.png"
        alt="menu-search" className="w-full" />
    </div>
  );
};

const PlusIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="w-5 h-5 text-foreground/80 flex items-center justify-center" onClick={onClick}>
      <img
        src="/icons/menu-plus.png"
        alt="menu-plus" className="w-full" />
    </div>
  );
};

