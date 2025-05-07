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

const WhiteArrowLeftIcon = () => {
    return (
        <img
            src="/icons/arrow/arrow-left-dark.png"
            alt="arrow-left" 
            className="h-full" 
        />
    );
};

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

export { ArrowLeftIcon, WhiteArrowLeftIcon, ArrowRightIcon };
