"use client";

import { useTheme } from "next-themes";

const SettingsIcon = () => {
    const { theme, systemTheme } = useTheme();

    const isDarkMode = theme === 'system'
        ? systemTheme === 'dark'
        : theme === 'dark';

    const iconPath = isDarkMode
        ? "/icons/menu/settings-dark.png"
        : "/icons/menu/settings.png";

    return (
        <img
            src={iconPath}
            alt="settings"
            className="w-full h-full"
        />
    );
};

export { SettingsIcon };
