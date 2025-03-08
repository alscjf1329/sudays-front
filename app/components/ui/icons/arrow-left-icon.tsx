import { useTheme } from "next-themes";

const ArrowLeftIcon = () => {
    const { theme } = useTheme();

    return (
        <img
            src={theme === 'dark'
                ? "/icons/arrow/arrow-left-dark.png"
                : "/icons/arrow/arrow-left.png"
            }
            alt="arrow-left" className="h-full" />
    );
};

export default ArrowLeftIcon;
