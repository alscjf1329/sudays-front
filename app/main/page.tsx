"use client";

import { useEffect, useState } from "react";
import LoadingBackground from "../components/layout/loading-backgroud";
import InstallPopup from "./components/install-popup";

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    setIsIOSDevice(/iPad|iPhone|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream);
  }, []);

  useEffect(() => {
    if(isIOSDevice){
      setInstallable(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isIOSDevice]);

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
            <div onClick={(e) => e.stopPropagation()}>
              <InstallPopup
                installable={installable}
                isIOSDevice={isIOSDevice}
                handleInstall={handleInstall}
              />
            </div>
          </LoadingBackground>
        </div>
      )}
    </div>
  );
}
