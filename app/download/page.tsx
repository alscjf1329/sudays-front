"use client";

import { useEffect, useState } from "react";
import InstallPopup from "./components/install-popup";
import { redirect } from "next/navigation";

function isPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export default function Download() {
  const today = new Date();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOSDevice(ios);
      setInstallable(!isPWA());
    };

    if (!deferredPrompt) {
      redirect(`/diary/${today.getFullYear()}/${today.getMonth() + 1}`);
    }

    checkDevice();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);

      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setInstallable(false);
        redirect(`/diary/${today.getFullYear()}/${today.getMonth() + 1}`);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  if (!installable) return null;

  return (
    <div 
      className="flex-1 flex flex-col justify-center items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <InstallPopup
        installable={installable}
        isIOSDevice={isIOSDevice}
        handleInstall={handleInstall}
      />
    </div>
  );
}
