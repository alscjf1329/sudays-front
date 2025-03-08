"use client";

import React, { useState } from "react";
import MonthCalendar from "./month-calendar";

const MultiMonthCalendar: React.FC<{ date: Date, numMonths: number, onClick?: () => void }> = ({ date, numMonths, onClick }) => {
  const [currentDate, setCurrentDate] = useState(date);

  const renderMonths = () => {
    const months = [];
    for (let i = 0; i < numMonths; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i);

      months.push(
        <MonthCalendar key={i} date={monthDate} readOnly={true} onClick={onClick}/>
      );
    }
    return months;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-wrap justify-center">
        {renderMonths().slice(0, 2)}
      </div>
      <div className="flex flex-wrap justify-center">
        {renderMonths().slice(2, 4)}
      </div>
    </div>
  );
};

export default MultiMonthCalendar;