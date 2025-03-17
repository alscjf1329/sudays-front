"use client";

import { useRef, use } from "react";
import YearCalendar from "@/app/components/ui/calendar/year-calendar";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    year: number
  }>
}

export default function YearPage({ params }: Props) {
  const { year } = use(params);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex flex-col h-full"
      ref={containerRef}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="flex-1">
        <YearCalendar year={year} date={new Date()} onClick={(year, month) => {
          redirect(`/diary/${year}/${month}`);
        }}/>
      </div>
    </div>  
  );
}
