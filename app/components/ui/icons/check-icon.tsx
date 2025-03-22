"use client";

import { useTheme } from "next-themes";

const CheckIcon = () => {
    const { theme, systemTheme } = useTheme();
    
    const isDarkMode = theme === 'system' 
        ? systemTheme === 'dark'
        : theme === 'dark';

    const iconPath = isDarkMode 
        ? "/icons/check/check-icon-dark.png"
        : "/icons/check/check-icon.png";

    return (
        <img
            src={iconPath}
            alt="check"
            className="w-full"
        />
    );
};

export default CheckIcon;
