import React from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { toPersianDigits } from '../utils/jalali';
import { TimelineType } from '../types';
import { Plus, CheckCircle2, Clock, Trash2, Calendar } from 'lucide-react';

interface TimelineTabProps {
  onOpenNewSlotModal: () => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ onOpenNewSlotModal }) => {
  const { slotsForSelectedDate, toggleTimelineSlot, deleteTimelineSlot } = useDailyManager();

  const typeConfig: Record<TimelineType, { label: string; badgeClass: string }> = {
    focus: {
      label: 'کار عمیق',
      badgeClass: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    work: {
      label: 'کار روزمره',
      badgeClass: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    meeting: {
      label: 'جلسه',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
    exercise: {
      label: 'ورزش و تحرک',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    break: {
      label: 'استراحت / غذا',
      badgeClass: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    personal: {
      label: 'امور شخصی',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            برنامه زمانی و جدول زمان‌بندی روز (Time Blocking)
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            بلوک‌بندی زمانی برای مدیریت هوشمند ساعات کاری، جلسات و زمان استراحت
          </p>
        </div>

        <button
          onClick={onOpenNewSlotModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن بلوک زمانی</span>
        </button>
      </div>

      {/* Timeline Schedule Agenda */}
      {slotsForSelectedDate.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Calendar className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            هنوز برنامه‌ای برای این روز تنظیم نشده است
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            ساعات روز خود را با افزودن بلوک‌های کاری و استراحت هدفمند کنید.
          </p>
          <button
            onClick={onOpenNewSlotModal}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            افزودن اولین بلوک زمانی
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-xs">
          <div className="relative border-r-2 border-indigo-100 dark:border-neutral-800 mr-4 pr-6 space-y-6">
            {slotsForSelectedDate.map((slot) => {
              const cfg = typeConfig[slot.type] || typeConfig.work;
              const isCompleted = slot.completed;

              return (
                <div key={slot.id} className="relative group">
                  {/* Timeline bullet */}
                  <div
                    className={`absolute -right-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors ${
                      isCompleted
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-white dark:bg-neutral-900 border-indigo-400 dark:border-indigo-600'
                    }`}
                  />

                  {/* Slot content card */}
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-neutral-50/60 dark:bg-neutral-800/30 border-neutral-200 dark:border-neutral-800 opacity-80'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700/80 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs font-mono tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{toPersianDigits(slot.startTime)}</span>
                          <span className="text-neutral-400">تا</span>
                          <span>{toPersianDigits(slot.endTime)}</span>
                        </div>
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${cfg.badgeClass}`}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleTimelineSlot(slot.id)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-indigo-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isCompleted ? 'انجام شد' : 'تکمیل'}</span>
                        </button>
                        <button
                          onClick={() => deleteTimelineSlot(slot.id)}
                          className="p-1 text-neutral-400 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                          title="حذف بلوک"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4
                      className={`text-sm font-semibold ${
                        isCompleted
                          ? 'line-through text-neutral-400 dark:text-neutral-500'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {slot.title}
                    </h4>

                    {slot.notes && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {slot.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
