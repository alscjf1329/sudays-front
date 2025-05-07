"use client";

import clsx from "clsx";
import React, { useState } from "react";

const MonthCalendar: React.FC<{ date: Date, readOnly?: boolean, hover?: boolean, onClick?: () => void }> = ({ date, readOnly = false, hover = false, onClick }) => {
  const [currentDate, setCurrentDate] = useState(date);
  const currentYear = Number(new Date().getFullYear());
  const currentMonth = Number(new Date().getMonth());
  const currentDay = Number(new Date().getDate());

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const renderDays = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div key={day} className={clsx(
          "text-center text-[3vmin] aspect-square flex items-center justify-center rounded-full",
          (currentYear === Number(currentDate.getFullYear()) &&
            currentMonth === Number(currentDate.getMonth()) &&
            day === currentDay) && "bg-[var(--highlight)] text-white"
        )}>
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={clsx(
      "flex flex-col w-full rounded-lg",
      hover && "hover:bg-[var(--hover)]"
    )}>
      {!readOnly && (
        <div className="flex justify-between items-center">
          <>
            <button
              className="bg-primary rounded-full hover:bg-primary-hover w-[20vmin] text-[3vmin]"
              onClick={handlePrevMonth}
            >
              이전
            </button>
          </>
          <div className="text-[4vmin] font-bold">
            {currentDate.getMonth() + 1}월
          </div>
          <>
            <button
              className="bg-primary rounded-full hover:bg-primary-hover w-[20vmin] text-[3vmin]"
              onClick={handleNextMonth}
            >
              다음
            </button>
          </>
        </div>
      )}
      {readOnly && (
        <div className={clsx(
          "text-[4vmin] font-bold",
          (currentYear === Number(currentDate.getFullYear()) && currentMonth === Number(currentDate.getMonth())) && "text-[var(--highlight)]"
        )}>
          {currentDate.getMonth() + 1}월
        </div>
      )}
      <div className="grid grid-cols-7 md:gap-2">{renderDays()}</div>
    </div>
  );
};

export default MonthCalendar;
