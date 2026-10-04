import React from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { ActiveTab } from '../types';
import { Sun, Moon, Plus, Download, Sparkles } from 'lucide-react';
import { downloadProjectZip } from '../utils/downloadProjectZip';

interface HeaderProps {
  onOpenNewTaskModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewTaskModal }) => {
  const { activeTab, setActiveTab, theme, toggleTheme } = useDailyManager();

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'overview', label: 'نمای کلی' },
    { id: 'timeline', label: 'برنامه زمانی' },
    { id: 'tasks', label: 'وظایف' },
    { id: 'habits', label: 'عادت‌ها' },
    { id: 'pomodoro', label: 'تمرکز' },
    { id: 'analytics', label: 'گزارش عملکرد' },
    { id: 'hedi', label: '🌷 هدی' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-black text-base shadow-sm">
              م
            </span>
            <span>مدیریار</span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions + quick utilities */}
        <div className="flex items-center gap-2">
          {/* Download project ZIP button */}
          <button
            onClick={downloadProjectZip}
            title="دانلود کل سورس کد پروژه به صورت فایل ZIP"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">دانلود ZIP</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="تغییر حالت شب و روز"
            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>وظیفه جدید</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden flex items-center overflow-x-auto border-t border-neutral-200 dark:border-neutral-800 px-3 py-1.5 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
