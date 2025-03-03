type TopBarProps = {
    children: React.ReactNode;
};

const TopBar: React.FC<TopBarProps> = ({ children }) => {
    return (
        <div className="fixed top-0 left-0 right-0 h-[60px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-end px-4 z-50">
            {children}
        </div>
    );
};

const TopBarContainer: React.FC = () => {
    return (
        <div className="h-[60px] bg-white dark:bg-gray-900 flex items-center">
        </div>
    );
};

export { TopBar, TopBarContainer };
