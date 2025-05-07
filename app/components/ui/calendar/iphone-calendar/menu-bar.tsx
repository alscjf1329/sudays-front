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
  );
};
