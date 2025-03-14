"use client";

import { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS_TO_SHOW = 12;

const BaseIphoneCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cellHeight, setCellHeight] = useState(0);
  const [months, setMonths] = useState<Date[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const isLoading = useRef(false);
  const [containerHeight, setContainerHeight] = useState(0);

  /**
   * ✅ 확대/축소 감지 및 차단
   */
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
        console.log("Pinch zoom prevented (multi-touch)");
      }
    };

    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        console.log("Ctrl + Wheel zoom prevented");
      }
    };

    const handleViewportResize = () => {
      if (window.visualViewport?.scale !== 1) {
        console.log("Visual viewport zoom detected and prevented");
      }
    };

    const gestureHandler = (e: Event) => {
      e.preventDefault();
      console.log(`Gesture zoom prevented (${e.type})`);
    };

    document.addEventListener("gesturestart", gestureHandler);
    document.addEventListener("gesturechange", gestureHandler);
    document.addEventListener("gestureend", gestureHandler);

    window.addEventListener("touchstart", preventZoom, { passive: false });
    window.addEventListener("wheel", preventWheelZoom, { passive: false });

    window.visualViewport?.addEventListener("resize", handleViewportResize);
    window.visualViewport?.addEventListener("scroll", handleViewportResize);

    return () => {
      document.removeEventListener("gesturestart", gestureHandler);
      document.removeEventListener("gesturechange", gestureHandler);
      document.removeEventListener("gestureend", gestureHandler);

      window.removeEventListener("touchstart", preventZoom);
      window.removeEventListener("wheel", preventWheelZoom);

      window.visualViewport?.removeEventListener("resize", handleViewportResize);
      window.visualViewport?.removeEventListener("scroll", handleViewportResize);
    };
  }, []);

  /**
   * ✅ 초기 월 리스트 생성 및 스크롤 위치 조정
   */
  useEffect(() => {
    const baseDate = new Date();
    const monthsList = [];

    for (let i = -MONTHS_TO_SHOW; i <= MONTHS_TO_SHOW; i++) {
      const date = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, 1);
      monthsList.push(date);
    }

    setMonths(monthsList);

    if (isInitialMount.current && containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          const scrollHeight = containerRef.current.scrollHeight;
          const clientHeight = containerRef.current.clientHeight;
          const centerPosition = (scrollHeight - clientHeight) / 2;
          containerRef.current.scrollTo({
            top: centerPosition,
            behavior: "auto",
          });
        }
      }, 100);
      isInitialMount.current = false;
    }
  }, []);

  /**
   * ✅ 화면 리사이즈시 셀 높이 계산
   */
  useEffect(() => {
    const calculateCellHeight = () => {
      const viewportHeight = window.innerHeight;
      const approximateHeaderHeight = 150;
      const availableHeight = viewportHeight - approximateHeaderHeight;
      const numberOfWeeks = 6;
      const newCellHeight = Math.floor(availableHeight / numberOfWeeks);
      setCellHeight(newCellHeight);
    };

    calculateCellHeight();
    window.addEventListener("resize", calculateCellHeight);
    return () => window.removeEventListener("resize", calculateCellHeight);
  }, []);

  /**
   * ✅ 컨테이너 높이 계산
   */
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const newHeight = viewportHeight - containerTop;
        setContainerHeight(newHeight);
      }
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => window.removeEventListener("resize", calculateHeight);
  }, []);

  /**
   * ✅ 요일 렌더링
   */
  const renderWeekdays = () =>
    WEEKDAYS.map((day, index) => (
      <div
        key={`weekday-${index}`}
        className={clsx(
          "flex items-center justify-center py-2 text-sm font-medium",
          index === 0 && "text-red-500",
          index === 6 && "text-blue-500",
          index !== 0 && index !== 6 && "text-muted"
        )}
      >
        {day}
      </div>
    ));

  /**
   * ✅ 월 렌더링
   */
  const renderMonth = (monthDate: Date, monthIndex: number) => {
    const today = new Date();
    const daysInMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    ).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`prev-${monthDate.getTime()}-${i}`}
          style={{ height: `${cellHeight}px` }}
          className="flex items-center justify-center"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (firstDay + day - 1) % 7;
      const isToday =
        day === today.getDate() &&
        monthDate.getMonth() === today.getMonth() &&
        monthDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={`current-${monthDate.getTime()}-${day}`}
          style={{ height: `${cellHeight}px` }}
          className={clsx(
            "flex items-center justify-center relative",
            "border-b border-[var(--light-border)]",
            dayOfWeek === 0 && "text-red-500",
            dayOfWeek === 6 && "text-blue-500",
            isToday && "font-bold"
          )}
        >
          <div
            className={clsx(
              "w-8 h-8 flex items-center justify-center rounded-full",
              isToday && "text-background bg-[var(--highlight)]"
            )}
          >
            {day}
          </div>
        </div>
      );
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div
          key={`next-${monthDate.getTime()}-${i}`}
          style={{ height: `${cellHeight}px` }}
          className="flex items-center justify-center"
        />
      );
    }

    return (
      <div
        key={`month-${monthDate.getTime()}-${monthIndex}`}
        className="month-container"
        data-year={monthDate.getFullYear()}
        data-month={monthDate.getMonth()}
      >
        <h2 className="text-2xl font-bold tracking-tight text-background mb-2">
          {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
        </h2>
        <div className="grid grid-cols-7">{days}</div>
      </div>
    );
  };

  /**
   * ✅ 스크롤 핸들링 및 월 추가
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isLoading.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const monthContainers = containerRef.current.querySelectorAll(".month-container");

      let closestMonth: HTMLElement | null = null;
      let minDistance = Infinity;

      monthContainers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const distance = Math.abs(rect.top - 150);

        if (distance < minDistance) {
          minDistance = distance;
          closestMonth = container as HTMLElement;
        }
      });

      if (closestMonth !== null) {
        const yearAttr = (closestMonth as HTMLElement).getAttribute("data-year");
        const monthAttr = (closestMonth as HTMLElement).getAttribute("data-month");

        if (yearAttr !== null && monthAttr !== null) {
          const newDate = new Date(Number(yearAttr), Number(monthAttr));

          setCurrentDate((prevDate) => {
            if (
              prevDate.getFullYear() === newDate.getFullYear() &&
              prevDate.getMonth() === newDate.getMonth()
            ) {
              return prevDate;
            }
            return newDate;
          });
        }
      }

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        isLoading.current = true;
        const lastMonth = months[months.length - 1];
        const newMonths: Date[] = [];
        for (let i = 1; i <= 12; i++) {
          newMonths.push(
            new Date(lastMonth.getFullYear(), lastMonth.getMonth() + i, 1)
          );
        }
        setMonths((prev) => [...prev, ...newMonths]);
        setTimeout(() => {
          isLoading.current = false;
        }, 500);
      }

      if (scrollTop <= 100) {
        isLoading.current = true;
        const firstMonth = months[0];
        const newMonths: Date[] = [];
        for (let i = 1; i <= 12; i++) {
          newMonths.unshift(
            new Date(firstMonth.getFullYear(), firstMonth.getMonth() - i, 1)
          );
        }

        requestAnimationFrame(() => {
          setMonths((prev) => [...newMonths, ...prev]);
          if (containerRef.current) {
            const monthHeight =
              containerRef.current.querySelector(".month-container")?.clientHeight || 0;
            const adjustment = monthHeight * 12;
            containerRef.current.scrollTop = adjustment;
          }
        });

        setTimeout(() => {
          isLoading.current = false;
        }, 500);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [months]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full overflow-y-auto relative"
      style={{ height: containerHeight ? `${containerHeight}px` : "auto" }}
    >
      <div className="sticky top-0 bg-[var(--background-secondary)] z-50 flex flex-col border-[var(--border)]">
        <h2 className="text-2xl font-bold tracking-tight text-background">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <div className="grid grid-cols-7 mt-4 border-b border-[var(--border)]">
          {renderWeekdays()}
        </div>
      </div>

      {months.map((monthDate, index) => renderMonth(monthDate, index))}
    </div>
  );
};

const IphoneCalendar = dynamic(() => Promise.resolve(BaseIphoneCalendar), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div>Loading...</div>
    </div>
  ),
});

export default IphoneCalendar;
