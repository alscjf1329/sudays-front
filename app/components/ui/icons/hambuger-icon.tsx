export const HamburgerIcon = ({ onClick }: { onClick?: () => void }) => {
    return (
        <div className="w-5 h-5 text-foreground/80 flex items-center justify-center" onClick={onClick}>
            <img
                src="/icons/menu-hamburger.png"
                alt="menu-hamburger" className="w-full" />
        </div>
    );
};