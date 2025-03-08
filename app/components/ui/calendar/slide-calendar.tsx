"use client";

import React, { useState, useEffect } from "react";
import { WEEKDAYS } from "@/app/lib/constants/calendar";
import LoadingBackground from "../../layout/loading-backgroud";
import MonthPicker from "./month-picker";

const SlideCalendar: React.FC<{ date: Date }> = ({ date }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(date);
  const [slideDirection, setSlideDirection] = useState<"up" | "down" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleMonthChange = (direction: "up" | "down") => {
    if (isAnimating) return;
    setSlideDirection(direction);
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentDate(new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + (direction === "up" ? 1 : -1)
      ));
      setSlideDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevMonth = () => handleMonthChange("down");
  const handleNextMonth = () => handleMonthChange("up");

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isAnimating) {
        e.deltaY > 0 ? handleNextMonth() : handlePrevMonth();
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isAnimating]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      distance > 0 ? handleNextMonth() : handlePrevMonth();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const renderWeekdays = () => (
    WEEKDAYS.map((day, index) => (
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
    ))
  );

  const renderDays = (date: Date) => {
    const today = new Date();
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
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDay + day - 1) % 7;
      const currentDateObj = new Date(date.getFullYear(), date.getMonth(), day);

      const isToday = day === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      const isFutureDate = currentDateObj > today;
      const isSmallerThanToday = day < today.getDate();

      days.push(
        <div
          key={day}
          className="relative group flex items-center justify-center h-full"
        >
          <div className={`
            aspect-square w-[90%] flex rounded-xl
            transition-all duration-200 text-lg font-medium
            ${isFutureDate ? 'text-gray-500' : `
              ${isSunday ? 'text-red-500' : ''}
              ${isSaturday ? 'text-blue-500' : ''}
              ${!isSunday && !isSaturday ? 'text-foreground' : ''}
            `
            }
            hover:text-foreground/50 hover:bg-[var(--hover)]
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
      {
        isOpen && (
          <LoadingBackground setIsOpen={setIsOpen}>
            <MonthPicker date={currentDate} setDate={setCurrentDate} />
          </LoadingBackground>
        )}
      <div className="flex justify-between items-center w-full mb-6" onClick={() => setIsOpen(true)}>
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

export default SlideCalendar;
