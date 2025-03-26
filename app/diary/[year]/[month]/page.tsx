"use client";

import { use, useRef, useState } from "react";
import IphoneCalendar from "@/app/components/ui/calendar/iphone-calendar/calendar";
import LoadingBackground from "@/app/components/layout/loading-backgroud";
import BottomPopup from "@/app/components/ui/bottom-popup";
import DiaryForm from "@/app/components/ui/diary/diary-form";
import { SlideBar } from "@/app/components/layout/slide-bar";
import { ArrowRightIcon, ArrowLeftIcon } from "@/app/components/ui/icons/arrow-icon";

type Props = {
  params: Promise<{
    year: number
    month: number
  }>
}

const Header = ({ 
  currentDate, 
  setCurrentDate, 
  handlePrevDay, 
  handleNextDay 
}: { 
  currentDate: Date, 
  setCurrentDate: (date: Date) => void, 
  handlePrevDay?: (beforeDate: Date, afterDate: Date) => void, 
  handleNextDay?: (beforeDate: Date, afterDate: Date) => void 
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4">
      <button
        className="bg-primary w-6 h-6 flex items-center justify-center"
        onClick={() => {
          const beforeDate = currentDate;
          const afterDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
          setCurrentDate(afterDate);
          handlePrevDay?.(beforeDate, afterDate);
        }}
      >
        <ArrowLeftIcon />
      </button>
      <div className="text-2xl font-bold px-4">
        {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, '0')}.{String(currentDate.getDate()).padStart(2, '0')}
      </div>
      <button
        className="bg-primary w-6 h-6 flex items-center justify-center"
        onClick={() => {
          const beforeDate = currentDate;
          const afterDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
          setCurrentDate(afterDate);
          handleNextDay?.(beforeDate, afterDate);
        }}
      >
        <ArrowRightIcon />
      </button>
    </div>
  )
}

export default function monthDiary({ params }: Props) {
  const { year, month } = use(params);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const diaryPopup = () => {
    const handleSubmit = async (data: any) => {
      try {
        // TODO: 여기에 데이터 저장 로직 추가
        console.log('일기 데이터:', data);
      } catch (error) {
        console.error('일기 저장 중 오류 발생:', error);
      }
    };

    return (
      <>
        <div className="flex flex-col h-full w-full md:hidden">
          <BottomPopup
            height="95%"
            onClose={() => setCurrentDate(null)}
          >
            <div className="flex flex-col h-full w-full">
              <Header
                currentDate={currentDate!}
                setCurrentDate={setCurrentDate}
                handlePrevDay={(beforeDate, afterDate) => {
                  console.log(beforeDate, afterDate);
                }}
                handleNextDay={(beforeDate, afterDate) => {
                  console.log(beforeDate, afterDate);
                }}
              />
              <DiaryForm onSubmit={handleSubmit} />
            </div>
          </BottomPopup>
        </div>
        <div className="hidden md:flex flex-col h-full w-full">
          <SlideBar direction="right">
            <div className="flex flex-col h-full w-full">
              <Header
                currentDate={currentDate!}
                setCurrentDate={setCurrentDate} 
                handlePrevDay={(beforeDate, afterDate) => {
                  console.log(beforeDate, afterDate);
                }}
                handleNextDay={(beforeDate, afterDate) => {
                  console.log(beforeDate, afterDate);
                }}
              />
              <DiaryForm onSubmit={handleSubmit} />
            </div>
          </SlideBar>
        </div>
      </>
    )
  }

  return (
    <div
      className="flex flex-col h-full w-full"
      ref={containerRef}
      style={{ overscrollBehavior: 'contain' }}
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
          {diaryPopup()}
        </LoadingBackground>
      )}
    </div>
  );
}
