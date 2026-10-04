import React from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { toPersianDigits, formatMinutesToPersian } from '../utils/jalali';
import { MoodType } from '../types';
import {
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  ArrowUpRight,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Calendar,
  Plus,
} from 'lucide-react';

interface OverviewTabProps {
  onOpenNewTaskModal: () => void;
  onOpenNewSlotModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onOpenNewTaskModal,
  onOpenNewSlotModal,
}) => {
  const {
    filteredTasksForDate,
    slotsForSelectedDate,
    habits,
    selectedDate,
    toggleTaskStatus,
    toggleHabitForDate,
    currentDailyLog,
    incrementWater,
    decrementWater,
    setMood,
    updateDailyLog,
    setActiveTab,
  } = useDailyManager();

  // Metrics calculations
  const totalTasks = filteredTasksForDate.length;
  const completedTasks = filteredTasksForDate.filter((t) => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalHabits = habits.length;
  const completedHabitsCount = habits.filter((h) => h.completedDates.includes(selectedDate)).length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabitsCount / totalHabits) * 100) : 0;

  // Top 3 priority tasks
  const topPriorityTasks = filteredTasksForDate.filter((t) => t.isTopPriority);

  // Next upcoming slot
  const nextSlot = slotsForSelectedDate.find((s) => !s.completed) || slotsForSelectedDate[0];

  const moods: { id: MoodType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'great', label: 'عالی و پرانرژی', icon: <Sparkles className="w-5 h-5" />, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' },
    { id: 'good', label: 'خوب و آرام', icon: <Smile className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' },
    { id: 'neutral', label: 'معمولی', icon: <Meh className="w-5 h-5" />, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800' },
    { id: 'tired', label: 'خسته یا کم‌رمق', icon: <Frown className="w-5 h-5" />, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800' },
    { id: 'stressed', label: 'پراسترس و شلوغ', icon: <Flame className="w-5 h-5" />, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tasks */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">وظایف روزانه</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {toPersianDigits(completedTasks)}
              </span>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">
                / {toPersianDigits(totalTasks)}
              </span>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
              {toPersianDigits(taskCompletionRate)}٪
            </span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Card 2: Habits */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">روتین‌ها و عادت‌ها</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {toPersianDigits(completedHabitsCount)}
              </span>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">
                / {toPersianDigits(totalHabits)}
              </span>
            </div>
            <span className="text-xs font-mono tabular-nums font-semibold text-amber-600 dark:text-amber-400">
              {toPersianDigits(habitCompletionRate)}٪
            </span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${habitCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Focus Time */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">تمرکز عمیق پومودورو</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {toPersianDigits(currentDailyLog.focusMinutes)}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">دقیقه</span>
            </div>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              {toPersianDigits(currentDailyLog.pomodoroSessionsCompleted)} پومودورو
            </span>
          </div>
          <div className="text-[11px] text-neutral-400 mt-2 truncate">
            {formatMinutesToPersian(currentDailyLog.focusMinutes)} کار پربازده
          </div>
        </div>

        {/* Card 4: Water */}
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">مصرف آب امروز</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
                {toPersianDigits(currentDailyLog.waterGlasses)}
              </span>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">/ ۸ لیوان</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={decrementWater}
                className="w-5 h-5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                -
              </button>
              <button
                onClick={incrementWater}
                className="w-5 h-5 rounded-md bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (currentDailyLog.waterGlasses / 8) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Priorities + Upcoming Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2 Cols: Top 3 Priorities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  ۳ اولویت طلایی روز (قانون تمرکز بالا)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>مشاهده همه وظایف</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {topPriorityTasks.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 text-xs">
                هنوز هیچ وظیفه‌ای به عنوان اولویت طلایی امروز نشانه‌گذاری نشده است.
                <div className="mt-2">
                  <button
                    onClick={onOpenNewTaskModal}
                    className="text-indigo-600 dark:text-indigo-400 font-medium underline cursor-pointer"
                  >
                    افزودن کار کلیدی امروز
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {topPriorityTasks.map((task, idx) => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-lg border transition-all ${
                        isDone
                          ? 'bg-neutral-50/70 dark:bg-neutral-800/30 border-neutral-200 dark:border-neutral-800 opacity-75'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700/80 hover:border-indigo-300 dark:hover:border-indigo-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                            isDone
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-neutral-300 dark:border-neutral-600 hover:border-indigo-500'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-sm font-medium ${
                                isDone
                                  ? 'line-through text-neutral-400'
                                  : 'text-neutral-900 dark:text-neutral-100'
                              }`}
                            >
                              <span className="font-mono tabular-nums text-neutral-400 ml-1.5">
                                {toPersianDigits(idx + 1)}.
                              </span>
                              {task.title}
                            </span>
                            {task.timeBlock && (
                              <span className="text-[11px] font-mono tabular-nums text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-sm shrink-0">
                                {task.timeBlock}
                              </span>
                            )}
                          </div>

                          {task.description && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}

                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 mt-1.5">
                              {task.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {task.subtasks.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
                              <span>چک‌لیست:</span>
                              <span className="font-mono tabular-nums">
                                {toPersianDigits(task.subtasks.filter((st) => st.completed).length)} از{' '}
                                {toPersianDigits(task.subtasks.length)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Habits for Today */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  عادت‌های روزانه امروز
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('habits')}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>مدیریت روتین‌ها</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {habits.slice(0, 6).map((habit) => {
                const isCompleted = habit.completedDates.includes(selectedDate);
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabitForDate(habit.id, selectedDate)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-right transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-neutral-900 dark:text-neutral-100'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? 'bg-amber-500 border-amber-500 text-white'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium truncate">{habit.title}</span>
                    </div>

                    <span className="text-[11px] font-mono tabular-nums text-amber-600 dark:text-amber-400 shrink-0">
                      {toPersianDigits(habit.streak)} روز
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 1 Col Sidebar: Upcoming Timeline + Mood + Journal */}
        <div className="space-y-4">
          {/* Next Scheduled Item */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                برنامه زمانی امروز
              </span>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer"
              >
                مشاهده جدول روز
              </button>
            </div>

            {nextSlot ? (
              <div className="p-3.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                <div className="text-[11px] font-mono tabular-nums text-indigo-700 dark:text-indigo-300 font-semibold mb-1">
                  {toPersianDigits(nextSlot.startTime)} تا {toPersianDigits(nextSlot.endTime)}
                </div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {nextSlot.title}
                </div>
                {nextSlot.notes && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {nextSlot.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-neutral-400 py-3 text-center">
                برنامه‌ای در جدول امروز ثبت نشده است.
              </div>
            )}

            <button
              onClick={onOpenNewSlotModal}
              className="mt-3 w-full py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن بلوک زمانی</span>
            </button>
          </div>

          {/* Daily Mood */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              حس و حال امروز شما چطور است؟
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {moods.map((m) => {
                const isSelected = currentDailyLog.mood === m.id;
                return (
                  <button
                    key={m.id}
                    title={m.label}
                    onClick={() => setMood(m.id)}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? `${m.color} ring-2 ring-indigo-500/20`
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {m.icon}
                  </button>
                );
              })}
            </div>
            {currentDailyLog.mood && (
              <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
                {moods.find((m) => m.id === currentDailyLog.mood)?.label}
              </p>
            )}
          </div>

          {/* Daily Gratitude & Reflection */}
          <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                شکرگزاری روزانه (نکات مثبت)
              </label>
              <textarea
                rows={2}
                value={currentDailyLog.gratitude || ''}
                onChange={(e) => updateDailyLog({ gratitude: e.target.value })}
                placeholder="۳ نعمتی که امروز بابت آن‌ها سپاسگزارید..."
                className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                بازتاب و یادداشت پایان روز
              </label>
              <textarea
                rows={2}
                value={currentDailyLog.reflectionNotes || ''}
                onChange={(e) => updateDailyLog({ reflectionNotes: e.target.value })}
                placeholder="مهم‌ترین درس، دستاورد یا نکته امروز..."
                className="w-full p-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
