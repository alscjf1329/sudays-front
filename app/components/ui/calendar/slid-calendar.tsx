"use client";

import React, { useState, useEffect } from "react";
import { WEEKDAYS } from "@/app/lib/constants/calendar";

const SlidCalendar: React.FC<{ date: Date }> = ({ date }) => {
  const [currentDate, setCurrentDate] = useState(date);
  const [slideDirection, setSlideDirection] = useState<"up" | "down" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 마우스 휠 이벤트
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;

      if (e.deltaY > 0) {
        handleNextMonth();
      } else if (e.deltaY < 0) {
        handlePrevMonth();
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isAnimating]);

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > 50) {
      handleNextMonth();
    } else if (distance < -50) {
      handlePrevMonth();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handlePrevMonth = () => {
    if (isAnimating) return;
    setSlideDirection("down");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1) );
      setSlideDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleNextMonth = () => {
    if (isAnimating) return;
    setSlideDirection("up");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
      setSlideDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const renderWeekdays = () => {
    return WEEKDAYS.map((day, index) => (
      <div
        key={`weekday-${index}`}
        className={`
          flex items-center justify-center py-2 text-base font-medium
          ${index === 0 ? 'text-red-500' : ''}
          ${index === 6 ? 'text-blue-500' : ''}
          ${index !== 0 && index !== 6 ? 'text-foreground/60' : ''}
        `}
      >
        {day}
      </div>
    ));
  };

  const renderDays = (date: Date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const days = [];

    // 빈 날짜 채우기
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="flex items-center justify-center h-full"
        />
      );
    }

    // 날짜 렌더링
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDay + day - 1) % 7;
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      
      const isToday = day === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const currentDateObj = new Date(date.getFullYear(), date.getMonth(), day);
      const isFutureDate = currentDateObj > today;

      days.push(
        <div
          key={day}
          className="relative group flex items-center justify-center h-full"
        >
          <div className={`
            aspect-square w-[90%] flex items-center justify-center rounded-full
            transition-all duration-200 text-lg font-medium
            ${isToday
              ? 'bg-primary text-primary-foreground font-bold scale-100'
              : `
                ${isFutureDate ? 'text-foreground/30' : `
                  ${isSunday ? 'text-red-500' : ''}
                  ${isSaturday ? 'text-blue-500' : ''}
                  ${!isSunday && !isSaturday ? 'text-foreground' : ''}
                `}
                hover:bg-muted/50 group-hover:scale-105
              `
            }
          `}>
            {day}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div
      className="flex flex-col items-center bg-background/50 rounded-xl shadow-lg p-8 select-none w-full max-w-2xl border border-border/50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-between items-center w-full mb-6">
        <h2 className="text-3xl font-bold text-foreground/90">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
      </div>
      <div className="w-full h-px bg-border/50 mb-6" />
      <div className="grid grid-cols-7 gap-3 w-full mb-2">
        {renderWeekdays()}
      </div>
      <div className="relative w-full h-80% overflow-hidden">
        <div
          className={`
            grid grid-cols-7 gap-3 h-full
            transition-all duration-300 ease-in-out
            ${slideDirection === "up" ? "-translate-y-full opacity-0" : ""}
            ${slideDirection === "down" ? "translate-y-full opacity-0" : ""}
          `}
        >
          {renderDays(currentDate)}
        </div>
      </div>
    </div>
  );
};

export default SlidCalendar;
