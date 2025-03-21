"use client";

import { useTheme } from "next-themes";

const PictureIcon = () => {
    const { theme } = useTheme();

    return (
        <img
            src={theme === 'dark'
                ? "/icons/picture/picture-icon-dark.png"
                : "/icons/picture/picture-icon.png"
            }
            alt="picture"
            className="w-full h-full"
        />
    );
};

export default PictureIcon;
