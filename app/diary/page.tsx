"use client";

import MultiMonthCalendar from "@/app/components/ui/calendar/multi-month-calendar";
import { useEffect, useState, useRef } from "react";

export default function Diary() {
  const [numMonths, setNumMonths] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          console.log("스크롤 끝에 도착했습니다."); // 스크롤 끝에 도착 시 콘솔 출력
          setNumMonths((prev) => prev + 1); // 다음 달력 추가
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
    <div className="flex flex-col items-center justify-center scroll-y-auto" ref={containerRef}>
      <MultiMonthCalendar date={new Date()} numMonths={numMonths} />
    </div>
  );
}
