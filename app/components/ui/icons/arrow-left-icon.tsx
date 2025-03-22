import { useTheme } from "next-themes";

const ArrowLeftIcon = () => {
    const { theme, systemTheme } = useTheme();
    
    const isDarkMode = theme === 'system' 
        ? systemTheme === 'dark'
        : theme === 'dark';

    const iconPath = isDarkMode 
        ? "/icons/arrow/arrow-left-dark.png"
        : "/icons/arrow/arrow-left.png";

    return (
        <img
            src={iconPath}
            alt="arrow-left" 
            className="h-full" 
        />
    );
};

export default ArrowLeftIcon;
