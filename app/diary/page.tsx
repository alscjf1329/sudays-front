"use client";

import { useRef } from "react";
import IphoneCalendar from "../components/ui/calendar/iphone-calendar/calendar";
export default function Diary() {
  const containerRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  return (
    <div
      className="flex flex-col h-full"
      ref={containerRef}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="flex-1">
        <IphoneCalendar year={today.getFullYear()} month={today.getMonth() + 1} />
      </div>
    </div>
  );
}
