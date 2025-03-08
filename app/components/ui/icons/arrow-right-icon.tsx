"use client";

import { useTheme } from "next-themes";

const ArrowRightIcon = () => {
    const { theme } = useTheme();

    return (
        <img
            src={theme === 'dark'
                ? "/icons/arrow/arrow-right-dark.png"
                : "/icons/arrow/arrow-right.png"
            }
            alt="arrow-right"
            className="h-full"
        />
    );
};

export default ArrowRightIcon;
