import { redirect } from "next/navigation";
import ArrowLeftIcon from "../../icons/arrow-left-icon";

export const MenuBar = ({ currentDate }: { currentDate: Date }) => {
  return (
    <div className="flex text-xl items-center justify-between" >
      <div className="flex gap-2">
        <div className="w-5 h-5 text-foreground/80" onClick={() => {
          redirect(`/diary/${currentDate.getFullYear()}`);
        }}>
          <ArrowLeftIcon />
        </div>
        {currentDate.getFullYear()}년
      </div>
      <div className="flex gap-4">
        <MenuShowIcon />
        <SearchIcon />
        <PlusIcon />
      </div>
    </div>
  );
};

const MenuShowIcon = () => {
  return (
    <div className="w-5 h-5 text-foreground/80 flex items-center justify-center">
      <img
        src="/icons/menu-show.png"
        alt="menu-show" className="w-full" />
    </div>
  );
};

const SearchIcon = () => {
  return (
    <div className="w-5 h-5 text-foreground/80 flex items-center justify-center">
      <img
        src="/icons/menu-search.png"
        alt="menu-search" className="w-full" />
    </div>
  );
};

const PlusIcon = () => {
  return (
    <div className="w-5 h-5 text-foreground/80 flex items-center justify-center">
      <img
        src="/icons/menu-plus.png"
        alt="menu-plus" className="w-full" />
    </div>
  );
};