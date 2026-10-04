import React, { useState } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { TimelineType } from '../types';
import { X } from 'lucide-react';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({ isOpen, onClose }) => {
  const { addTimelineSlot, selectedDate } = useDailyManager();

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [type, setType] = useState<TimelineType>('work');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTimelineSlot({
      date: selectedDate,
      startTime,
      endTime,
      title: title.trim(),
      type,
      completed: false,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  const types: { id: TimelineType; label: string }[] = [
    { id: 'focus', label: 'کار عمیق و تمرکز' },
    { id: 'work', label: 'کار روزمره' },
    { id: 'meeting', label: 'جلسه و مکالمه' },
    { id: 'exercise', label: 'ورزش و تحرک' },
    { id: 'break', label: 'استراحت و ناهار' },
    { id: 'personal', label: 'امور شخصی و خانواده' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            افزودن بلوک زمانی به جدول روزانه
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              عنوان برنامه <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: جلسه آنلاین با کارفرما، کار روی ماژول پرداخت..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                ساعت شروع
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                ساعت پایان
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              نوع فعالیت
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TimelineType)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              یادداشت کوتاه (اختیاری)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="نکات مرتبط، لینک جلسه یا ملزومات..."
              className="w-full px-3.5 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              ثبت زمان‌بندی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
