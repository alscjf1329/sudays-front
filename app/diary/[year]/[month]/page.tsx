"use client";

import { use, useRef } from "react";
import IphoneCalendar from "@/app/components/ui/calendar/iphone-calendar/calendar";

type Props = {
  params: Promise<{
    year: number
    month: number
  }>
}

export default function monthDiary({ params }: Props) {
  const { year, month } = use(params);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex flex-col h-full"
      ref={containerRef}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="flex-1">
        <IphoneCalendar year={year} month={month} />
      </div>
    </div>
  );
}
