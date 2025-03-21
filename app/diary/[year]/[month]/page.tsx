"use client";

import { use, useRef, useState } from "react";
import IphoneCalendar from "@/app/components/ui/calendar/iphone-calendar/calendar";
import LoadingBackground from "@/app/components/layout/loading-backgroud";
import BottomPopup from "@/app/components/ui/bottom-popup";
import DiaryForm from "@/app/components/ui/diary/diary-form";
import { SlideBar } from "@/app/components/layout/slide-bar";

type Props = {
  params: Promise<{
    year: number
    month: number
  }>
}



export default function monthDiary({ params }: Props) {
  const { year, month } = use(params);
  const [isPopupOpen, setIsPopupOpen] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const diaryPopup = () => {
    return (
      <>
        <div className="flex flex-col h-full md:hidden">
          <BottomPopup
            height="95%"
            onClose={() => setIsPopupOpen(null)}
          >
            <DiaryForm
              onSubmit={async (data) => {
                try {
                  // TODO: 여기에 데이터 저장 로직 추가
                  console.log('일기 데이터:', data);
                } catch (error) {
                  console.error('일기 저장 중 오류 발생:', error);
                }
              }}
            />
          </BottomPopup>
        </div>
        <div className="hidden md:flex flex-col h-full">
          <SlideBar 
            direction="right"
          >
            <DiaryForm
              onSubmit={async (data) => {
                try {
                  // TODO: 여기에 데이터 저장 로직 추가
                  console.log('일기 데이터:', data);
                } catch (error) {
                  console.error('일기 저장 중 오류 발생:', error);
                }
              }}
            />
          </SlideBar>
        </div>
      </>
    )
  }

  return (
    <div
      className="flex flex-col h-full"
      ref={containerRef}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="flex-1">
        <IphoneCalendar year={year} month={month} onClick={(date: Date) => {
          setIsPopupOpen(date);
        }} />
      </div>
      {isPopupOpen && (
        <LoadingBackground setIsOpen={() => setIsPopupOpen(null)}>
          {diaryPopup()}
        </LoadingBackground>
      )}
    </div>
  );
}
