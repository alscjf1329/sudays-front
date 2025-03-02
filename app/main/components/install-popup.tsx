'use client';

import BottomPopup from "@/app/components/ui/bottom-popup";


interface InstallPopupUIProps {
    installable: boolean;
    handleInstall: () => void;
}

const MobileInstallPopup = ({ handleInstall }: { handleInstall: () => void }) => (
    <BottomPopup height="30%">
        <div className="w-full h-full flex flex-col justify-center items-center p-4">
            <div className="flex-1 justify-center items-center">
                <p className="text-2xl font-bold">SUDAYS</p>
            </div>
            <hr className="w-full" />
            <div className="flex-2 justify-center items-center">
                <p className="text-xl font-bold text-gray-500">SUDAYS 앱을 설치하시겠습니까?</p>
            </div>
            <div className="flex-1 justify-center items-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold" onClick={handleInstall}>
                    앱 이용하기
                </button>
            </div>
        </div>
    </BottomPopup>
);

export default function InstallPopupUI({ installable, handleInstall }: InstallPopupUIProps) {
    if (!installable) return null;

    return (
        <MobileInstallPopup handleInstall={handleInstall} />
    );
}

