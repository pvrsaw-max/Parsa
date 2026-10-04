import React, { useState, useEffect } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import {
  formatJalaliDate,
  toISODate,
  toPersianDigits,
} from '../utils/jalali';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';

export const DateSelector: React.FC = () => {
  const { selectedDate, setSelectedDate } = useDailyManager();
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [dayProgressPercent, setDayProgressPercent] = useState<number>(0);

  const todayIso = toISODate(new Date());

  useEffect(() => {
    const updateTimeAndProgress = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${hours}:${mins}`);

      // Calculate progress of working day (06:00 to 23:00 -> 17 hours = 1020 mins)
      const minutesPassedToday = now.getHours() * 60 + now.getMinutes();
      const startOfDay = 6 * 60; // 06:00
      const endOfDay = 23 * 60; // 23:00
      let percent = 0;
      if (minutesPassedToday <= startOfDay) {
        percent = 5;
      } else if (minutesPassedToday >= endOfDay) {
        percent = 100;
      } else {
        percent = Math.round(((minutesPassedToday - startOfDay) / (endOfDay - startOfDay)) * 100);
      }
      setDayProgressPercent(percent);
    };

    updateTimeAndProgress();
    const timer = setInterval(updateTimeAndProgress, 60000);
    return () => clearInterval(timer);
  }, []);

  const changeDateByDays = (delta: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + delta);
    setSelectedDate(toISODate(date));
  };

  const selectedDateObj = (() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d);
  })();

  const isToday = selectedDate === todayIso;

  return (
    <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-3.5 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Display and Navigation */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => changeDateByDays(1)}
              title="روز بعد"
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => changeDateByDays(-1)}
              title="روز قبل"
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <h2 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
              {formatJalaliDate(selectedDateObj)}
            </h2>
            {isToday && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                امروز
              </span>
            )}
          </div>

          {/* Quick jumps */}
          <div className="flex items-center gap-1.5 text-xs">
            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayIso)}
                className="px-2.5 py-1 rounded-md text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
              >
                بازگشت به امروز
              </button>
            )}
          </div>
        </div>

        {/* Live Clock & Day Progress Indicator */}
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
            <span>ساعت فعلی:</span>
            <span className="font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
              {toPersianDigits(currentTimeStr)}
            </span>
          </div>

          {isToday && (
            <div className="flex items-center gap-2.5 min-w-[160px]">
              <span className="text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                سپری‌شده از روز:
              </span>
              <div className="w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${dayProgressPercent}%` }}
                />
              </div>
              <span className="font-mono tabular-nums text-neutral-700 dark:text-neutral-300 font-medium">
                {toPersianDigits(dayProgressPercent)}٪
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
