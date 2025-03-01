"use client";

import { useEffect, useState } from "react";
import BottomPopup from "./components/bottom-popup";
import LoadingBackground from "./components/loading-backgroud";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault(); // 기본 이벤트 방지
      setDeferredPrompt(e); // 이벤트 저장
      setInstallable(true); // 설치 가능 상태 업데이트
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    (deferredPrompt as any).prompt();
    const { outcome } = await (deferredPrompt as any).userChoice;
    console.log("User response to install prompt:", outcome);

    setDeferredPrompt(null); // 한 번 사용한 후 초기화
    setInstallable(false);
  };

  const MobileInstallPopup = ({ handleInstall }: { handleInstall: () => void }) => (
    <BottomPopup height="30%" setIsOpen={() => {setInstallable(false);}}>
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

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <p className="text-4xl font-bold">SUDAYS</p>
        {installable && (
          <div className="block md:hidden">
            <LoadingBackground setIsOpen={setInstallable}>
              <MobileInstallPopup handleInstall={handleInstall} />
            </LoadingBackground>
          </div>
        )}
    </div>
  );
}
