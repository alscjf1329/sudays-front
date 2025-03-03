'use client';


interface InstallPopupUIProps {
    installable: boolean;
    isIOSDevice: boolean;
    handleInstall: () => void;
}

const MobileInstallPopup = ({ handleInstall, isIOSDevice }: { handleInstall: () => void, isIOSDevice: boolean }) => {
    return isIOSDevice ? (
        <div className="w-full h-screen flex flex-col justify-center items-center p-8">
            {/* 로고 또는 앱 이름 */}
            <div className="flex flex-1 justify-center items-center">
                <p className="text-2xl text-black font-bold">SUDAYS</p>
            </div>

            {/* 구분선 */}
            <hr className="w-full my-4" />

            {/* 안내 문구 및 아이콘 (justify-between 적용) */}
            <div className="flex flex-col flex-7 justify-center items-center w-full">
                <div className="text-center mb-8">
                    <p className="text-lg font-bold text-gray-500">더 나은 경험을 위해</p>
                    <p className="text-lg font-bold text-gray-500">SUDAYS 앱을 설치해보세요</p>
                </div>

                {/* iOS 설치 방법 안내 */}
                <div className="flex flex-col justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                        <p className="text-xl text-black font-bold">iOS의 경우</p>
                        <img src="/icons/share-icon.png" alt="공유" className="w-5 h-5" />
                        <p className="text-xl text-black font-bold">를 클릭하여</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <p className="text-xl text-black font-bold">홈 화면 추가(</p>
                        <img src="/icons/add-icon.png" alt="홈 화면 추가" className="w-5 h-5" />
                        <p className="text-xl text-black font-bold">) 버튼을 통해</p>
                    </div>

                    <p className="text-xl text-black font-bold">앱을 설치해보세요!</p>
                </div>
            </div>
            <div className="flex justify-center items-center hover:cursor-pointer hover:underline" onClick={() => {
                window.location.href = '/main';
            }}>
                웹으로 그냥 보기
            </div>
        </div>

    ) : (
        <div className="w-full h-screen flex flex-col justify-center items-center p-8">
            <div className="flex-1 justify-center items-center">
                <p className="text-2xl text-black font-bold">SUDAYS</p>
            </div>
            <hr className="w-full my-4" />
            <div className="flex flex-col flex-7 justify-center items-center w-full">
                <div className="flex flex-col justify-center items-center mb-8">
                    <p className="text-xl text-center font-bold text-gray-500">더 나은 경험을 위해</p>
                    <p className="text-xl text-center font-bold text-gray-500">SUDAYS 앱을 설치해보세요</p>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold" onClick={handleInstall}>
                    앱 이용하기
                </button>
            </div>
            <div className="flex justify-center items-center hover:cursor-pointer hover:underline" onClick={() => {
                window.location.href = '/main';
            }}>
                웹으로 그냥 보기
            </div>
        </div>
    )
};

export default function InstallPopup({ installable, isIOSDevice, handleInstall }: InstallPopupUIProps) {
    if (!installable) return null;

    return (
        <MobileInstallPopup handleInstall={handleInstall} isIOSDevice={isIOSDevice} />
    );
}

