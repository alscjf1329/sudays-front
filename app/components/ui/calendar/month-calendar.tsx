"use client";

import React, { useState } from "react";

const MonthCalendar: React.FC<{ date: Date, readOnly?: boolean, onClick?: () => void }> = ({ date, readOnly = false, onClick }) => {
  const [currentDate, setCurrentDate] = useState(date);

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
        <div key={day} className="day">
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center p-2">
        {!readOnly && (
          <>
            <button
              className="bg-primary py-2 px-5 mr-2 rounded-full hover:bg-primary-hover"
              onClick={handlePrevMonth}
            >
              이전
            </button>
          </>
        )}
        <h2 className="text-2xl font-bold">
          {currentDate.getFullYear()}.{currentDate.getMonth() + 1}
        </h2>
        {!readOnly && (
          <>  
            <button
              className="bg-primary py-2 px-5 ml-2 rounded-full hover:bg-primary-hover"
              onClick={handleNextMonth}
            >
              다음
            </button>
          </>
        )}
      </div>
      <div className="grid grid-cols-7 gap-2 p-5">{renderDays()}</div>
    </div>
  );
};

export default MonthCalendar;
