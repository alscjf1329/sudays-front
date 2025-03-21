"use client";

import { useTheme } from "next-themes";

const CheckIcon = () => {
    const { theme } = useTheme();

    return (
        <img
            src={theme === 'dark'
                ? "/icons/check/check-icon-dark.png"
                : "/icons/check/check-icon.png"
            }
            alt="check"
            className="w-full"
        />
    );
};

export default CheckIcon;
