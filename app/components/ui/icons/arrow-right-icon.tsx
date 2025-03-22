"use client";

import { useTheme } from "next-themes";

const ArrowRightIcon = () => {
    const { theme, systemTheme } = useTheme();
    
    const isDarkMode = theme === 'system' 
        ? systemTheme === 'dark'
        : theme === 'dark';

    const iconPath = isDarkMode 
        ? "/icons/arrow/arrow-right-dark.png"
        : "/icons/arrow/arrow-right.png";

    return (
        <img
            src={iconPath}
            alt="arrow-right"
            className="h-full"
        />
    );
};

export default ArrowRightIcon;
