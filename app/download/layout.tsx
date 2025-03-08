import type { Metadata, Viewport } from "next";
import "@/app/globals.css";

export default function DownloadLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/sudays-icon-192.png",
    shortcut: "/icons/sudays-icon-192.png",
    apple: "/icons/sudays-icon-192.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/icons/sudays-icon-192.png",
    },
  },
};
