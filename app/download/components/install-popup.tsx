'use client';

interface InstallPopupUIProps {
    installable: boolean;
    isIOSDevice: boolean;
    handleInstall: () => void;
}

const MobileInstallPopup = ({ handleInstall, isIOSDevice }: { handleInstall: () => void, isIOSDevice: boolean }) => {
    return isIOSDevice ? (
        <div className="flex flex-1 flex-col justify-between items-center p-8">
            <div className="flex flex-1 justify-center items-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">SUDAYS</p>
            </div>
            <hr className="w-full my-4 border-[var(--border)]" />
            <div className="flex flex-col flex-7 justify-center items-center w-full">
                <div className="text-center mb-8">
                    <p className="text-lg font-semibold text-[var(--foreground)]">더 나은 경험을 위해</p>
                    <p className="text-lg font-semibold text-[var(--foreground)]">SUDAYS 앱을 설치해보세요</p>
                </div>
                <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                        <p className="text-xl font-semibold text-[var(--foreground)]">iOS의 경우</p>
                        <img src="/icons/share-icon.png" alt="공유" className="w-5 h-5" />
                        <p className="text-xl font-semibold text-[var(--foreground)]">를 클릭하여</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <p className="text-xl font-semibold text-[var(--foreground)]">홈 화면 추가(</p>
                        <img src="/icons/add-icon.png" alt="홈 화면 추가" className="w-5 h-5" />
                        <p className="text-xl font-semibold text-[var(--foreground)]">) 버튼을 통해</p>
                    </div>
                    <p className="text-xl font-semibold text-[var(--foreground)]">앱을 설치해보세요!</p>
                </div>
            </div>
            <div className="text-[var(--primary)] hover:text-[var(--accent)] hover:cursor-pointer hover:underline transition-colors duration-200" onClick={() => window.location.href = '/main'}>
                웹으로 그냥 보기
            </div>
        </div>
    ) : (
        <div className="flex flex-1 flex-col justify-between items-center p-8">
            <div className="flex-1 justify-center items-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">SUDAYS</p>
            </div>
            <hr className="w-full my-4 border-[var(--border)]" />
            <div className="flex flex-col flex-7 justify-center items-center w-full">
                <div className="flex flex-col justify-center items-center mb-8">
                    <p className="text-xl text-center font-semibold text-[var(--foreground)]">더 나은 경험을 위해</p>
                    <p className="text-xl text-center font-semibold text-[var(--foreground)]">SUDAYS 앱을 설치해보세요</p>
                </div>
                <button 
                    className="bg-[var(--primary)] hover:bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg" 
                    onClick={handleInstall}
                >
                    앱 이용하기
                </button>
            </div>
            <div className="text-[var(--primary)] hover:text-[var(--accent)] hover:cursor-pointer hover:underline transition-colors duration-200" onClick={() => window.location.href = '/diary'}>
                웹으로 그냥 보기
            </div>
        </div>
    );
};

export default function InstallPopup({ installable, isIOSDevice, handleInstall }: InstallPopupUIProps) {
    if (!installable) return null;
    return <MobileInstallPopup handleInstall={handleInstall} isIOSDevice={isIOSDevice} />;
}
