"use client";

import ArrowRightIcon from "../icon/arrow-right-icon";
import ArrowLeftIcon from "../icon/arrow-left-icon copy";

const MonthPicker: React.FC<{date: Date, setDate: (date: Date) => void }> = ({ date, setDate }) => {
  const months = Array.from({ length: 12 }, (_, i) => i);



  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setDate(new Date(year, date.getMonth(), date.getDate()));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setDate(new Date(date.getFullYear(), month, date.getDate()));
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4 rounded-lg bg-card shadow-md bg-[var(--background)]">
      <div className="flex items-center w-full justify-between px-2">
        <button
          className="p-2 rounded-full hover:bg-muted transition-colors duration-200 active:scale-95"
          onClick={() => setDate(new Date(date.getFullYear() - 1, date.getMonth(), date.getDate()))}
        >
          <div className="w-5 h-5 text-foreground/80">
            <ArrowLeftIcon />
          </div>
        </button>
        <h1 className="text-2xl font-bold text-foreground">{date.getFullYear()}년</h1>
        <button
          className="p-2 rounded-full hover:bg-muted transition-colors duration-200 active:scale-95"
          onClick={() => setDate(new Date(date.getFullYear() + 1, date.getMonth(), date.getDate()))}
        >
          <div className="w-5 h-5 text-foreground/80">
            <ArrowRightIcon />
          </div>
        </button>
      </div>
      <div className="w-full px-2">
        <div className="grid grid-cols-4 grid-rows-3 gap-3">
          {months.map(m => (
            <button
              key={m}
              value={m}
              className={`
                p-3 rounded-lg text-center text-base font-medium
                transition-all duration-200 
                ${date.getMonth() + 1 === m
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground hover:text-foreground/80'
                }
                active:scale-95
              `}
              onClick={() => setDate(new Date(date.getFullYear(), m, date.getDate()))}
            >
              {m + 1}월
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthPicker;
