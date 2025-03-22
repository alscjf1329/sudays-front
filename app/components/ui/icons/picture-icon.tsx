"use client";

import { useTheme } from "next-themes";

const PictureIcon = () => {
    const { theme, systemTheme } = useTheme();
    
    const isDarkMode = theme === 'system' 
        ? systemTheme === 'dark'
        : theme === 'dark';

    const iconPath = isDarkMode 
        ? "/icons/picture/picture-icon-dark.png"
        : "/icons/picture/picture-icon.png";

    return (
        <img
            src={iconPath}
            alt="picture"
            className="w-full h-full"
        />
    );
};

export default PictureIcon;
