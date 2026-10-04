import React, { useState, useEffect, useRef } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { toPersianDigits, formatMinutesToPersian } from '../utils/jalali';
import { playChimeSound } from '../utils/sound';
import { Play, Pause, RotateCcw, SkipForward, Clock, Target, CheckCircle2 } from 'lucide-react';

type PomodoroMode = 'work' | 'short_break' | 'long_break';

export const PomodoroTab: React.FC = () => {
  const { filteredTasksForDate, currentDailyLog, addPomodoroSession } = useDailyManager();

  const [mode, setMode] = useState<PomodoroMode>('work');
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);

  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Set initial time when mode or durations change
  useEffect(() => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workMinutes * 60);
    } else if (mode === 'short_break') {
      setTimeLeft(shortBreakMinutes * 60);
    } else {
      setTimeLeft(longBreakMinutes * 60);
    }
  }, [mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

  // Countdown effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    playChimeSound();

    if (mode === 'work') {
      addPomodoroSession(workMinutes);
      // Auto transition to short break
      setMode('short_break');
    } else {
      // Transition back to work
      setMode('work');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') setTimeLeft(workMinutes * 60);
    else if (mode === 'short_break') setTimeLeft(shortBreakMinutes * 60);
    else setTimeLeft(longBreakMinutes * 60);
  };

  const skipTimer = () => {
    if (window.confirm('آیا می‌خواهید این جلسه را رد کرده و به بخش بعدی بروید؟')) {
      handleSessionComplete();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration =
    mode === 'work'
      ? workMinutes * 60
      : mode === 'short_break'
      ? shortBreakMinutes * 60
      : longBreakMinutes * 60;

  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  const activeTask = filteredTasksForDate.find((t) => t.id === selectedTaskId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          تایمر تمرکز پومودورو (Deep Focus)
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          روش اثبات‌شده تمرکز ۲۵ دقیقه‌ای و استراحت منظم برای حداکثر بازدهی ذهنی
        </p>
      </div>

      {/* Main Timer Box */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm text-center">
        {/* Mode Selector */}
        <div className="inline-flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-8">
          {[
            { id: 'work', label: 'تمرکز عمیق (کار)' },
            { id: 'short_break', label: 'استراحت کوتاه' },
            { id: 'long_break', label: 'استراحت طولانی' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as PomodoroMode)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === m.id
                  ? 'bg-white dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Big Tabular Digits Display */}
        <div className="relative my-4 flex flex-col items-center justify-center">
          <div className="text-6xl sm:text-7xl font-mono tabular-nums font-bold tracking-tight text-neutral-900 dark:text-neutral-100 selection:bg-none">
            {toPersianDigits(timeFormatted)}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full mt-6 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                mode === 'work' ? 'bg-indigo-600' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Task selector to link focus session */}
        <div className="mt-6 mb-8 max-w-sm mx-auto">
          <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center justify-center gap-1">
            <Target className="w-3.5 h-3.5" />
            <span>اتصال به وظیفه مشخص (اختیاری):</span>
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden"
          >
            <option value="">-- بدون وظیفه خاص (تمرکز عمومی) --</option>
            {filteredTasksForDate.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          {activeTask && (
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium truncate">
              در حال تمرکز روی: {activeTask.title}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetTimer}
            className="p-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            title="بازنشانی تایمر"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="px-8 py-3.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>توقف موقت</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>شروع تمرکز</span>
              </>
            )}
          </button>

          <button
            onClick={skipTimer}
            className="p-3 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
            title="رد کردن این جلسه"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Duration Customization Row */}
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500">
          <span>تنظیم زمان دلخواه:</span>
          <div className="flex items-center gap-2">
            {[25, 45, 50].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setWorkMinutes(mins);
                  if (mode === 'work') setTimeLeft(mins * 60);
                }}
                className={`px-2.5 py-1 rounded-md font-mono tabular-nums transition-colors cursor-pointer ${
                  workMinutes === mins
                    ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200'
                }`}
              >
                {toPersianDigits(mins)} دقیقه
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Stats Today */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">جلسات تکمیل‌شده امروز</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {toPersianDigits(currentDailyLog.pomodoroSessionsCompleted)} پومودورو
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-neutral-400">مجموع دقایق تمرکز مفید</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {formatMinutesToPersian(currentDailyLog.focusMinutes)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
