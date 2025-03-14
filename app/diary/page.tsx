"use client";

import { useRef } from "react";
import IphoneCalendar from "../components/ui/calendar/ipone-calendar";
export default function Diary() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex flex-col h-full"
      ref={containerRef}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="flex-1">
        <IphoneCalendar />
      </div>
    </div>
  );
}
