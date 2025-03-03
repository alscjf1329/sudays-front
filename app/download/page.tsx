"use client";

import { useEffect, useState } from "react";
import InstallPopup from "./components/install-popup";

function isPWA() {
  if (window.matchMedia('(display-mode: standalone)').matches)
    return true;
  if ((window as any).standalone === true)
    return true;
  else
    return false;
}

export default function Download() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    setInstallable(!isPWA());
    setIsIOSDevice(/iPad|iPhone|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream);
  }, []);

  useEffect(() => {
    if (isIOSDevice) {
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

    window.location.href = '/main';

    setDeferredPrompt(null);
    setInstallable(false);
  };

  return installable && (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div onClick={(e) => e.stopPropagation()}>
        <InstallPopup
          installable={installable}
          isIOSDevice={isIOSDevice}
          handleInstall={handleInstall}
        />
      </div>
    </div>
  );
}
