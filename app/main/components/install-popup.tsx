'use client';

import BottomPopup from "@/app/components/ui/bottom-popup";


interface InstallPopupUIProps {
    installable: boolean;
    isIOSDevice: boolean;
    handleInstall: () => void;
}

const MobileInstallPopup = ({ handleInstall, isIOSDevice }: { handleInstall: () => void, isIOSDevice: boolean }) => {
    return isIOSDevice ? (
        <BottomPopup height="40%">
            <div className="w-full h-full flex flex-col justify-center items-center p-4">
                <div className="flex-1 justify-center items-center">
                    <p className="text-2xl text-black font-bold">SUDAYS</p>
                </div>
                <hr className="w-full" />
                <div className="flex-2 justify-center items-center">
                    <p className="text-lg text-center font-bold text-gray-500">더 나은 경험을 위해</p>
                    <p className="text-lg text-center font-bold text-gray-500">SUDAYS 앱을 설치해보세요</p>
                </div>
                <div className="flex items-center space-x-1">
                    <p className="text-xl text-black font-bold">iOS의 경우</p>
                    <img src="/icons/share-icon.png" alt="공유" className="w-5 h-5" />
                    <p className="text-xl text-black font-bold">를 클릭하여</p>
                </div>
                <div className="flex items-center space-x-1">
                    <p className="text-xl text-black font-bold">홈 화면 추가(</p>
                    <img src="/icons/add-icon.png" alt="공유" className="w-5 h-5" />
                    <p className="text-xl text-black font-bold">) 버튼을 통해</p>
                </div>
                <div className="flex items-center space-x-1">
                    <p className="text-xl text-black font-bold">앱을 설치해보세요!</p>
                </div>
            </div>
        </BottomPopup>
    ) : (
        <BottomPopup height="30%">
            <div className="w-full h-full flex flex-col justify-center items-center p-4">
                <div className="flex-1 justify-center items-center">
                    <p className="text-2xl text-black font-bold">SUDAYS</p>
                </div>
                <hr className="w-full" />
                <div className="flex-2 justify-center items-center">
                    <p className="text-xl text-center font-bold text-gray-500">더 나은 경험을 위해</p>
                    <p className="text-xl text-center font-bold text-gray-500">SUDAYS 앱을 설치해보세요</p>
                </div>
                <div className="flex-1 justify-center items-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold" onClick={handleInstall}>
                        앱 이용하기
                    </button>
                </div>
            </div>
        </BottomPopup>
    )
};

export default function InstallPopup({ installable, isIOSDevice, handleInstall }: InstallPopupUIProps) {
    if (!installable) return null;

    return (
        <MobileInstallPopup handleInstall={handleInstall} isIOSDevice={isIOSDevice} />
    );
}

