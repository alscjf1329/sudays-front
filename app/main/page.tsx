"use client";

import { useEffect, useState } from "react";
import InstallPopupUI from './components/install-popup';
import LoadingBackground from "../components/layout/loading-backgroud";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const isDeviceIOS =
      /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isDeviceIOS);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
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

    setDeferredPrompt(null);
    setInstallable(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <p className="text-4xl font-bold">SUDAYS</p>
      {installable && (
        <div className="block md:hidden">
          <LoadingBackground setIsOpen={setInstallable}>
            <InstallPopupUI
              installable={installable}
              handleInstall={handleInstall}
            />
          </LoadingBackground>
        </div>
      )}
    </div>
  );
}
