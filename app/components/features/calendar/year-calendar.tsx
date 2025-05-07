"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import clsx from "clsx";
import MonthCalendar from "./month-calendar";

// 상수값 정의
const INITIAL_LOAD_COUNT = 10; // 초기 로드할 연도 수
const YEAR_BATCH_COUNT = 10; // 추가로 로드할 연도 수
const SCROLL_THRESHOLD = 100;
const SCROLL_DEBOUNCE_TIME = 150;

const YearCalendarInfinite: React.FC<{
  year?: number;
  date: Date;
  onClick?: (year: number, month: number) => void;
}> = ({ year, date, onClick }) => {
  const currentYearValue = useMemo(() => new Date().getFullYear(), []);

  // ✅ year를 무조건 baseYear로 사용
  const baseYear = useMemo(() => {
    const convertedYear = Number(year);
    return !isNaN(convertedYear) && convertedYear > 0
      ? convertedYear
      : date.getFullYear();
  }, [year, date]);

  // ✅ 초기 years 배열 생성 (useMemo + useState 초기값)
  const initialYears = useMemo(() => {
    return Array.from(
      { length: INITIAL_LOAD_COUNT * 2 + 1 },
      (_, i) => baseYear + (i - INITIAL_LOAD_COUNT)
    );
  }, [baseYear]);

  const [years, setYears] = useState<number[]>(initialYears);
  const [currentYear, setCurrentYear] = useState<number>(baseYear);

  const containerRef = useRef<HTMLDivElement>(null);
  const isLoading = useRef(false);
  const isInitialMount = useRef(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // ✅ 스크롤 이벤트 디바운스 처리
  const debounceScroll = useCallback((callback: () => void) => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(callback, SCROLL_DEBOUNCE_TIME);
  }, []);

  // ✅ 연도 추가 로직
  const addYears = useCallback(
    (direction: "prev" | "next") => {
      if (isLoading.current) return;
      isLoading.current = true;

      setYears((prev) => {
        const base = direction === "prev" ? prev[0] : prev[prev.length - 1];
        if (typeof base !== "number" || isNaN(base)) return prev;

        const newYears = Array.from({ length: YEAR_BATCH_COUNT }, (_, i) =>
          direction === "prev"
            ? base - (i + 1)
            : base + (i + 1)
        );

        return direction === "prev"
          ? [...newYears.reverse(), ...prev]
          : [...prev, ...newYears];
      });

      setTimeout(() => {
        isLoading.current = false;
      }, 300);
    },
    []
  );

  // ✅ 스크롤 핸들러
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isLoading.current) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    debounceScroll(() => {
      const yearContainers = container.querySelectorAll(".year-container");
      const viewportCenter =
        container.getBoundingClientRect().top + clientHeight / 2;

      let closestYear: HTMLElement | null = null;
      let minDistance = Infinity;

      yearContainers.forEach((yearContainer) => {
        const rect = yearContainer.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestYear = yearContainer as HTMLElement;
        }
      });

      if (closestYear) {
        const yearAttr = (closestYear as HTMLElement).getAttribute("data-year");
        const parsedYear = Number(yearAttr);
        if (!isNaN(parsedYear)) setCurrentYear(parsedYear);
      }

      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
        addYears("next");
      } else if (scrollTop <= SCROLL_THRESHOLD) {
        addYears("prev");
      }
    });
  }, [debounceScroll, addYears]);

  // ✅ 초기 스크롤 위치 조정 (requestAnimationFrame)
  useEffect(() => {
    if (!isInitialMount.current) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollToCenter = () => {
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const centerPosition = (scrollHeight - clientHeight) / 2;

      container.scrollTo({
        top: centerPosition,
        behavior: "auto",
      });
      isInitialMount.current = false;
    };

    const rafId = requestAnimationFrame(scrollToCenter);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ✅ 스크롤 이벤트 등록 및 정리
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // ✅ 연도별 월 달력 렌더링
  const renderYear = useCallback(
    (year: number) => (
      <div
        key={year}
        data-year={year.toString()}
        className="year-container flex-1 flex flex-col border-b border-[var(--border)] p-4"
      >
        <div
          className={clsx(
            "text-4xl font-bold mb-4",
            year === currentYearValue && "text-[var(--highlight)]"
          )}
        >
          {year}년
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-10 md:p-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              onClick={() => onClick?.(year, i + 1)}
            >
              <MonthCalendar
                date={new Date(year, i, 1)}
                readOnly={true}
                hover={true}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    [currentYearValue, onClick]
  );

  // ✅ 전체 반환
  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full overflow-y-auto relative"
      style={{ height: "100vh" }}
    >
      {/* 상단 고정 헤더 */}
      <div className="sticky top-0 bg-[var(--background-secondary)]/80 backdrop-blur-sm z-50 flex flex-col border-[var(--border)] p-4">
        <div className="text-2xl font-bold">{currentYear}년</div>
      </div>

      {/* 연도별 월 달력 렌더링 */}
      {years
        .filter((y) => typeof y === "number" && !isNaN(y))
        .map((year) => renderYear(year))}
    </div>
  );
};

export default YearCalendarInfinite;
