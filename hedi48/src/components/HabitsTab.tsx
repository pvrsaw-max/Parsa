import React from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { Habit, HabitPeriod } from '../types';
import { toISODate, toPersianDigits, gregorianToJalali } from '../utils/jalali';
import { Plus, Flame, Check, Sun, Sunset, Moon, Edit2, Trash2 } from 'lucide-react';

interface HabitsTabProps {
  onOpenNewHabitModal: () => void;
  onEditHabit: (habit: Habit) => void;
}

export const HabitsTab: React.FC<HabitsTabProps> = ({ onOpenNewHabitModal, onEditHabit }) => {
  const { habits, toggleHabitForDate, deleteHabit, selectedDate } = useDailyManager();

  // Generate the last 7 days ending with selectedDate or today
  const last7Days = (() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const centerDate = new Date(y, m - 1, d);
    const days: { iso: string; weekdayName: string; dayNum: string; isToday: boolean }[] = [];
    const todayIso = toISODate(new Date());

    const weekdayShortNames = ['یک', 'دو', 'سه', 'چهار', 'پنج', 'جمعه', 'شن'];

    for (let i = 6; i >= 0; i--) {
      const target = new Date(centerDate);
      target.setDate(centerDate.getDate() - i);
      const iso = toISODate(target);
      const j = gregorianToJalali(target.getFullYear(), target.getMonth() + 1, target.getDate());

      days.push({
        iso,
        weekdayName: weekdayShortNames[target.getDay()],
        dayNum: toPersianDigits(j.jd),
        isToday: iso === todayIso,
      });
    }
    return days;
  })();

  const periods: { id: HabitPeriod; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'morning',
      label: 'روتین‌های صبحگاهی',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      color: 'border-amber-200 dark:border-amber-900/60',
    },
    {
      id: 'afternoon',
      label: 'روتین‌های بعد از ظهر و کاری',
      icon: <Sunset className="w-4 h-4 text-orange-500" />,
      color: 'border-orange-200 dark:border-orange-900/60',
    },
    {
      id: 'evening',
      label: 'روتین‌های شبانگاهی و خواب',
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      color: 'border-indigo-200 dark:border-indigo-900/60',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            عادت‌ها، روتین‌ها و زنجیره پیوستگی
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            پیگیری روزانه رفتارهای کوچک که نتایج شگفت‌انگیز پایدار می‌آفرینند
          </p>
        </div>

        <button
          onClick={onOpenNewHabitModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>عادت جدید</span>
        </button>
      </div>

      {/* Habits grouped by period */}
      <div className="space-y-6">
        {periods.map((period) => {
          const periodHabits = habits.filter((h) => h.period === period.id);

          return (
            <div
              key={period.id}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs"
            >
              {/* Period title */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  {period.icon}
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {period.label}
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-neutral-400">
                    ({toPersianDigits(periodHabits.length)})
                  </span>
                </div>

                {/* Day column headers for the 7 days */}
                <div className="hidden sm:flex items-center gap-2 text-center text-[11px] font-mono tabular-nums text-neutral-400">
                  {last7Days.map((d) => (
                    <div key={d.iso} className="w-8">
                      <div>{d.weekdayName}</div>
                      <div className={d.iso === selectedDate ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}>
                        {d.dayNum}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {periodHabits.length === 0 ? (
                <div className="text-center py-6 text-neutral-400 text-xs">
                  عادی در این بازه تعریف نشده است.
                </div>
              ) : (
                <div className="space-y-3">
                  {periodHabits.map((habit) => {
                    const isTodayCompleted = habit.completedDates.includes(selectedDate);

                    return (
                      <div
                        key={habit.id}
                        className={`p-3.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isTodayCompleted
                            ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-200/60 dark:border-amber-900/30'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                        }`}
                      >
                        {/* Title & Streak info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => toggleHabitForDate(habit.id, selectedDate)}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                isTodayCompleted
                                  ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                                  : 'border-neutral-300 dark:border-neutral-600 hover:border-amber-500'
                              }`}
                              title="تغییر وضعیت برای روز انتخابی"
                            >
                              {isTodayCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>

                            <div>
                              <h4
                                className={`text-sm font-semibold ${
                                  isTodayCompleted
                                    ? 'text-neutral-900 dark:text-neutral-100 font-bold'
                                    : 'text-neutral-800 dark:text-neutral-200'
                                }`}
                              >
                                {habit.title}
                              </h4>
                              {habit.notes && (
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                                  {habit.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 7-day completion dots & Streak */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                          {/* Streak badge */}
                          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 font-mono tabular-nums bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{toPersianDigits(habit.streak)} روز پیوسته</span>
                          </div>

                          {/* 7 Days Dots */}
                          <div className="flex items-center gap-2">
                            {last7Days.map((d) => {
                              const done = habit.completedDates.includes(d.iso);
                              return (
                                <button
                                  key={d.iso}
                                  onClick={() => toggleHabitForDate(habit.id, d.iso)}
                                  title={`${d.weekdayName} ${d.dayNum} - ${done ? 'انجام شد' : 'ثبت نشده'}`}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors cursor-pointer ${
                                    done
                                      ? 'bg-amber-500 text-white shadow-2xs font-bold'
                                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                  }`}
                                >
                                  {done ? <Check className="w-4 h-4 stroke-[3]" /> : '·'}
                                </button>
                              );
                            })}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onEditHabit(habit)}
                              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
                              title="ویرایش عادت"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteHabit(habit.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                              title="حذف عادت"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
