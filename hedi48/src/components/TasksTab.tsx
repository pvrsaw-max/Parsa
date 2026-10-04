import React, { useState, useMemo } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { Task, Priority, TaskStatus } from '../types';
import { toPersianDigits, formatMinutesToPersian } from '../utils/jalali';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Tags,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { CategoryManagerModal } from './CategoryManagerModal';

export type TaskSortOption = 'priority-desc' | 'priority-asc' | 'dueDate' | 'time' | 'default';

interface TasksTabProps {
  onOpenNewTaskModal: () => void;
  onEditTask: (task: Task) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({ onOpenNewTaskModal, onEditTask }) => {
  const { tasks, toggleTaskStatus, deleteTask, toggleSubtask, updateTask, categories, getCategoryById } =
    useDailyManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<TaskSortOption>('priority-desc');
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const toggleExpand = (taskId: string) => {
    setExpandedTaskIds((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Collect all unique tags across tasks
  const allTags = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      t.tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const list = tasks.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().replace(/^#+/, '');
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesTag = t.tags?.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }

      // Category
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

      // Priority
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) return false;

      // Tag filter
      if (selectedTag !== 'all') {
        if (!t.tags || !t.tags.includes(selectedTag)) return false;
      }

      // Status
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed' && t.status !== 'completed') return false;
        if (statusFilter === 'in_progress' && t.status !== 'in_progress') return false;
        if (statusFilter === 'todo' && t.status !== 'todo') return false;
      }

      return true;
    });

    const priorityWeights: Record<Priority, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return list.sort((a, b) => {
      if (sortBy === 'priority-desc') {
        // High to Low, pinning Top Priority tasks first
        if (a.isTopPriority && !b.isTopPriority) return -1;
        if (!a.isTopPriority && b.isTopPriority) return 1;
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
      if (sortBy === 'priority-asc') {
        // Low to High
        return priorityWeights[a.priority] - priorityWeights[b.priority];
      }
      if (sortBy === 'dueDate') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      if (sortBy === 'time') {
        return (b.estimatedMinutes || 0) - (a.estimatedMinutes || 0);
      }
      return 0;
    });
  }, [tasks, searchQuery, selectedCategory, selectedPriority, selectedTag, statusFilter, sortBy]);

  const priorityConfig: Record<Priority, { label: string; textClass: string; bgClass: string }> = {
    high: {
      label: 'بالا',
      textClass: 'text-rose-600 dark:text-rose-400',
      bgClass: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
    },
    medium: {
      label: 'متوسط',
      textClass: 'text-amber-600 dark:text-amber-400',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
    },
    low: {
      label: 'پایین',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            مدیریت وظایف و برنامه‌های روزانه
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            سازماندهی کارها بر اساس دسته‌بندی دلخواه، اولویت و زیروظایف
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Tags className="w-4 h-4 text-indigo-500" />
            <span>مدیریت دسته‌ها</span>
          </button>

          <button
            onClick={onOpenNewTaskModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>وظیفه جدید</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در عنوان یا توضیحات وظایف..."
              className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Status Tabs and Sort Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
              {[
                { id: 'all', label: 'همه' },
                { id: 'todo', label: 'انجام‌نشده' },
                { id: 'in_progress', label: 'در حال انجام' },
                { id: 'completed', label: 'تکمیل‌شده' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id as TaskStatus | 'all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    statusFilter === s.id
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 px-2 rounded-lg text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TaskSortOption)}
                className="bg-transparent text-neutral-800 dark:text-neutral-200 text-xs font-medium focus:outline-hidden cursor-pointer"
                title="مرتب‌سازی بر اساس اهمیت یا تاریخ"
              >
                <option value="priority-desc">اولویت (زیاد به کم · اهمیت بالا)</option>
                <option value="priority-asc">اولویت (کم به زیاد · اهمیت پایین)</option>
                <option value="dueDate">تاریخ موعد</option>
                <option value="time">زمان تخمینی</option>
                <option value="default">پیش‌فرض</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Category Filters & Priority */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <span className="text-neutral-400">دسته‌بندی:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'
            }`}
          >
            همه دسته‌ها
          </button>

          {categories.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs font-semibold'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.name}</span>
              </button>
            );
          })}

          <span className="text-neutral-400 mr-2">اولویت:</span>
          {[
            { id: 'all', label: 'همه' },
            { id: 'high', label: 'بالا (High)' },
            { id: 'medium', label: 'متوسط (Medium)' },
            { id: 'low', label: 'پایین (Low)' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPriority(p.id as Priority | 'all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedPriority === p.id
                  ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 shadow-xs font-semibold'
                  : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Dynamic Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
            <span className="text-neutral-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-500" />
              <span>برچسب‌ها:</span>
            </span>

            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                selectedTag === 'all'
                  ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 font-semibold'
                  : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'
              }`}
            >
              همه برچسب‌ها
            </button>

            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? 'all' : tag)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span>#{tag}</span>
                  {isSelected && <span className="text-[10px]">✕</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <CheckCircle2 className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            وظیفه‌ای با این مشخصات یافت نشد
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            فیلترها را تغییر دهید یا یک وظیفه جدید ثبت کنید.
          </p>
          <button
            onClick={onOpenNewTaskModal}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            افزودن وظیفه
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';
            const priorityInfo = priorityConfig[task.priority];
            const isExpanded = !!expandedTaskIds[task.id];
            const completedSubCount = task.subtasks.filter((st) => st.completed).length;
            const catObj = getCategoryById(task.category);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-neutral-50/70 dark:bg-neutral-800/30 border-neutral-200 dark:border-neutral-800 opacity-75'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      isCompleted
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : isInProgress
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-indigo-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isInProgress ? (
                      <Circle className="w-2.5 h-2.5 fill-current" />
                    ) : null}
                  </button>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            isCompleted
                              ? 'line-through text-neutral-400 dark:text-neutral-500'
                              : 'text-neutral-900 dark:text-neutral-100'
                          }`}
                        >
                          {task.title}
                        </h4>

                        {task.isTopPriority && (
                          <span
                            title="اولویت طلایی امروز"
                            className="inline-flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950/40 p-0.5 rounded-sm"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded-md border font-medium ${priorityInfo.bgClass} ${priorityInfo.textClass}`}
                        >
                          اولویت {priorityInfo.label}
                        </span>

                        {/* Dynamic Category Badge with its specific color */}
                        <span
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium border flex items-center gap-1.5"
                          style={{
                            backgroundColor: catObj.color + '14',
                            color: catObj.color,
                            borderColor: catObj.color + '33',
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: catObj.color }}
                          />
                          <span>{catObj.name}</span>
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        {task.description}
                      </p>
                    )}

                    {/* Custom Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {task.tags.map((tag) => {
                          const isTagSelected = selectedTag === tag;
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(isTagSelected ? 'all' : tag);
                              }}
                              title={`فیلتر بر اساس #${tag}`}
                              className={`text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors cursor-pointer flex items-center gap-0.5 ${
                                isTagSelected
                                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                              }`}
                            >
                              <span>#{tag}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Metadata bar */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                      {task.timeBlock && (
                        <div className="flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{toPersianDigits(task.timeBlock)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1 font-mono tabular-nums">
                        <span>زمان تخمینی:</span>
                        <span>{formatMinutesToPersian(task.estimatedMinutes)}</span>
                      </div>

                      {task.subtasks.length > 0 && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
                        >
                          <span>چک‌لیست ({toPersianDigits(completedSubCount)}/{toPersianDigits(task.subtasks.length)})</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {/* In progress toggle button */}
                      <button
                        onClick={() =>
                          updateTask(task.id, {
                            status: task.status === 'in_progress' ? 'todo' : 'in_progress',
                          })
                        }
                        className={`px-2 py-0.5 text-[11px] rounded-md transition-colors cursor-pointer ${
                          task.status === 'in_progress'
                            ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-medium'
                            : 'text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        {task.status === 'in_progress' ? 'در حال انجام' : 'علامت به عنوان در حال کار'}
                      </button>
                    </div>

                    {/* Expandable Subtasks */}
                    {isExpanded && task.subtasks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                        {task.subtasks.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => toggleSubtask(task.id, st.id)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-xs cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 text-indigo-600 rounded-sm cursor-pointer"
                            />
                            <span
                              className={
                                st.completed
                                  ? 'line-through text-neutral-400'
                                  : 'text-neutral-800 dark:text-neutral-200'
                              }
                            >
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
                      title="ویرایش"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                      title="حذف"
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

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />
    </div>
  );
};

