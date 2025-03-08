"use client";

import { useEffect, useRef } from "react";
import SlideCalendar from "../components/ui/calendar/slide-calendar";

export default function Diary() {
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
      <SlideCalendar date={new Date()} />
    </div>
  );
}
