"use client";

import { use, useEffect, useRef, useState } from "react";
import IphoneCalendar from "@/app/components/ui/calendar/iphone-calendar/calendar";
import LoadingBackground from "@/app/components/layout/loading-backgroud";
import BottomPopup from "@/app/components/ui/bottom-popup";
import DiaryForm from "@/app/components/ui/diary/diary-form";
import { SlideBar } from "@/app/components/layout/slide-bar";
import { ArrowRightIcon, ArrowLeftIcon } from "@/app/components/ui/icons/arrow-icon";
import { diaryService } from "@/lib/api/diary";

type Props = {
  params: Promise<{
    year: number;
    month: number;
  }>;
};

const Header = ({
  currentDate,
  setCurrentDate,
  handlePrevDay,
  handleNextDay,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  handlePrevDay?: (beforeDate: Date, afterDate: Date) => void;
  handleNextDay?: (beforeDate: Date, afterDate: Date) => void;
}) => {
  return (
    <div className="flex items-center py-4">
      {handlePrevDay && (
        <button
          className="bg-primary w-6 h-6 flex items-center justify-center"
          onClick={() => {
            const beforeDate = currentDate;
            const afterDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() - 1
            );
            setCurrentDate(afterDate);
            handlePrevDay(beforeDate, afterDate);
          }}
        >
          <ArrowLeftIcon />
        </button>
      )}
      <div className="text-2xl font-bold mx-4">
        {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, "0")}.{String(currentDate.getDate()).padStart(2, "0")}
      </div>
      {handleNextDay && (
        <button
          className="bg-primary w-6 h-6 flex items-center justify-center"
          onClick={() => {
            const beforeDate = currentDate;
            const afterDate = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate() + 1
            );
            setCurrentDate(afterDate);
            handleNextDay(beforeDate, afterDate);
          }}
        >
          <ArrowRightIcon />
        </button>
      )}
    </div>
  );
};

const DiaryPopup = ({
  currentDate,
  setCurrentDate,
}: {
  currentDate: Date;
  setCurrentDate: (date: Date | null) => void;
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    if (currentDate) {
      setTimeout(() => {
        setIsOpened(true);
      }, 50);
    } else {
      setIsOpened(false);
    }
  }, [currentDate]);

  const handleClose = () => {
    setIsOpened(false);
    setTimeout(() => {
      setCurrentDate(null);
    }, 500);
  };

  const handleSubmit = async (data: { content: string; images: File[] }) => {
    try {
      const yyyymmdd = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, "0")}${String(currentDate.getDate()).padStart(2, "0")}`;
      await diaryService.upsertDiary(yyyymmdd, data.content, data.images);
      handleClose();
    } catch (error) {
      console.error("일기 저장 중 오류 발생:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full md:hidden">
        <BottomPopup height="95%" onClose={handleClose}>
          <div className="flex flex-col h-full w-full">
            <Header currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <DiaryForm date={currentDate} onSubmit={handleSubmit} />
          </div>
        </BottomPopup>
      </div>
      <div className="hidden md:flex flex-col h-full w-full">
        <SlideBar direction="right" width="60%" isOpened={isOpened} setIsOpened={setIsOpened}>
          <div className="flex flex-col h-full w-full">
            <Header currentDate={currentDate} setCurrentDate={setCurrentDate} />
            <DiaryForm date={currentDate} onSubmit={handleSubmit} />
          </div>
        </SlideBar>
      </div>
    </>
  );
};

export default function monthDiary({ params }: Props) {
  const { year, month } = use(params);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex flex-col h-full w-full"
      ref={containerRef}
      style={{ overscrollBehavior: "contain" }}
    >
      <div className="flex-1 w-full">
        <IphoneCalendar
          year={year}
          month={month}
          onClick={(date: Date) => setCurrentDate(date)}
        />
      </div>
      {currentDate && (
        <LoadingBackground setIsOpen={() => setCurrentDate(null)}>
          <DiaryPopup currentDate={currentDate} setCurrentDate={setCurrentDate} />
        </LoadingBackground>
      )}
    </div>
  );
}
