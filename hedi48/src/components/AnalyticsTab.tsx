import React, { useRef, useState } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { toPersianDigits, formatMinutesToPersian } from '../utils/jalali';
import { downloadProjectZip } from '../utils/downloadProjectZip';
import { Category } from '../types';
import {
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Clock,
  Flame,
  FileCheck,
  Archive,
} from 'lucide-react';

export const AnalyticsTab: React.FC = () => {
  const {
    tasks,
    categories,
    habits,
    currentDailyLog,
    exportData,
    importData,
    resetToSampleData,
  } = useDailyManager();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Overall Task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const overallTaskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const categoryCounts = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Habit consistency calculation
  const totalHabitEntries = habits.reduce((acc, h) => acc + h.completedDates.length, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;

      // Validate backup file before importing to avoid broken state from invalid files.
      try {
        JSON.parse(content);
      } catch {
        setImportStatus('خطا در خواندن فایل پشتیبان. لطفاً فایل معتبر انتخاب کنید.');
        setTimeout(() => setImportStatus(null), 4000);
        return;
      }

      const success = importData(content);
      if (success) {
        setImportStatus('داده‌ها با موفقیت بازیابی شدند.');
      } else {
        setImportStatus('خطا در خواندن فایل پشتیبان. لطفاً فایل معتبر انتخاب کنید.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید همه داده‌ها را به داده‌های نمونه اولیه بازنشانی کنید؟')) {
      resetToSampleData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
          آمار، گزارش عملکرد و مدیریت داده‌ها
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          بررسی روند پیشرفت شخصی، بهره‌وری و خروجی گرفتن از اطلاعات
        </p>
      </div>

      {/* 4 Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">مجموع وظایف تکمیل‌شده</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {toPersianDigits(completedTasks)}
            </span>
            <span className="text-xs font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold">
              {toPersianDigits(overallTaskRate)}٪ کل
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">ثبت موفقیت‌آمیز عادات</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {toPersianDigits(totalHabitEntries)}
            </span>
            <span className="text-xs text-neutral-400">تکرار ثبت‌شده</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">دقایق تمرکز عمیق امروز</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {toPersianDigits(currentDailyLog.focusMinutes)}
            </span>
            <span className="text-xs text-neutral-400">دقیقه</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-medium">وضعیت مصرف آب روز</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100">
              {toPersianDigits(currentDailyLog.waterGlasses)}
            </span>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold font-mono tabular-nums">
              {toPersianDigits(Math.min(100, Math.round((currentDailyLog.waterGlasses / 8) * 100)))}٪
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Category distribution & Habits progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category distribution */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              توزیع وظایف در دسته‌بندی‌های مختلف
            </h3>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => {
              const count = categoryCounts[cat.id] || 0;
              const percent = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </span>
                    <span className="font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                      {toPersianDigits(count)} مورد ({toPersianDigits(percent)}٪)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Habit Leaderboard */}
        <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              بیشترین زنجیره‌های استمرار در عادات
            </h3>
          </div>

          <div className="space-y-3">
            {habits
              .slice()
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 5)
              .map((h, idx) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono tabular-nums font-bold text-neutral-400">
                      {toPersianDigits(idx + 1)}.
                    </span>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {h.title}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400">
                    {toPersianDigits(h.streak)} روز پیوسته
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Backup and Data Management */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          پشتیبان‌گیری و مدیریت داده‌های محلی
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          اطلاعات شما در مرورگر ذخیره می‌شود. می‌توانید از داده‌های خود نسخه پشتیبان با فرمت JSON
          دریافت کنید یا در دستگاه دیگری بازیابی نمایید.
        </p>

        {importStatus && (
          <div className="mb-4 p-3 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadProjectZip}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Archive className="w-4 h-4" />
            <span>دانلود سورس‌کد کامل پروژه (فایل ZIP)</span>
          </button>

          <button
            onClick={exportData}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل پشتیبان (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>بارگذاری و بازیابی فایل</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-2 mr-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بازنشانی به داده‌های اولیه</span>
          </button>
        </div>
      </div>
    </div>
  );
};
