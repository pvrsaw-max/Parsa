import React, { useState, useEffect } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { Habit, HabitCategory, HabitPeriod } from '../types';
import { X } from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
}

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, onClose, habitToEdit }) => {
  const { addHabit, updateHabit } = useDailyManager();

  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState<HabitPeriod>('morning');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setPeriod(habitToEdit.period);
      setCategory(habitToEdit.category);
      setTargetDaysPerWeek(habitToEdit.targetDaysPerWeek);
      setNotes(habitToEdit.notes || '');
    } else {
      setTitle('');
      setPeriod('morning');
      setCategory('health');
      setTargetDaysPerWeek(7);
      setNotes('');
    }
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (habitToEdit) {
      updateHabit(habitToEdit.id, {
        title: title.trim(),
        period,
        category,
        targetDaysPerWeek,
        notes: notes.trim() || undefined,
      });
    } else {
      addHabit({
        title: title.trim(),
        period,
        category,
        targetDaysPerWeek,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  const periods: { id: HabitPeriod; label: string }[] = [
    { id: 'morning', label: 'صبحگاهی' },
    { id: 'afternoon', label: 'بعد از ظهر' },
    { id: 'evening', label: 'شامگاهی' },
  ];

  const categories: { id: HabitCategory; label: string }[] = [
    { id: 'health', label: 'سلامت و جسمانی' },
    { id: 'mind', label: 'ذهن و آرامش' },
    { id: 'productivity', label: 'بهره‌وری و کارایی' },
    { id: 'learning', label: 'رشد و یادگیری' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {habitToEdit ? 'ویرایش عادت روزانه' : 'تعریف روتین یا عادت جدید'}
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
              عنوان عادت <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: ۱۵ دقیقه مطالعه، نوشیدن آب ناشتا، پیاده‌روی..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                زمان اجرای روتین
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as HabitPeriod)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                دسته‌بندی
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              هدف هفتگی (تعداد روز در هفته)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setTargetDaysPerWeek(num)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    targetDaysPerWeek === num
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                  }`}
                >
                  {num} روز
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              نکته یا دلیل ایجاد عادت (اختیاری)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="انگیزه یا یادآور شخصی..."
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
              {habitToEdit ? 'ذخیره تغییرات' : 'ثبت عادت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
