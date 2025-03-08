"use client";

import { useEffect, useState, useRef } from "react";
import MonthPicker from "@/app/components/ui/calendar/month-picker";
import MultiMonthCalendar from "../components/ui/calendar/multi-month-calendar";
import SlidCalendar from "../components/ui/calendar/slid-calendar";

export default function Diary() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          console.log("스크롤 끝에 도착했습니다."); // 스크롤 끝에 도착 시 콘솔 출력
        }
      }
    };

    const currentRef = containerRef.current;
    currentRef?.addEventListener("scroll", handleScroll);
    return () => {
      currentRef?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center scroll-y-auto" ref={containerRef}>
      <SlidCalendar date={new Date()} />
    </div>
  );
}
