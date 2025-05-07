"use client";

import { useTheme } from "next-themes";

const HamburgerIcon = () => {
    const { theme, systemTheme } = useTheme();

    const isDarkMode = theme === 'system'
        ? systemTheme === 'dark'
        : theme === 'dark';

    const iconPath = isDarkMode
        ? "/icons/menu/hamburger-dark.png"
        : "/icons/menu/hamburger.png";

    return (
        <img
            src={iconPath}
            alt="hamburger"
            className="w-full h-full"
        />
    );
};

export { HamburgerIcon };
