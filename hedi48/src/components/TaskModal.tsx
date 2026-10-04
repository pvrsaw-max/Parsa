import React, { useState, useEffect, useMemo } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { Task, Priority } from '../types';
import { toPersianDigits } from '../utils/jalali';
import { X, Plus, Trash2, CheckCircle2, Tags, Tag, ArrowUp, Minus, ArrowDown } from 'lucide-react';
import { CategoryManagerModal } from './CategoryManagerModal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, updateTask, selectedDate, categories, getCategoryById, tasks } = useDailyManager();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(categories[0]?.id || 'work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(selectedDate);
  const [timeBlock, setTimeBlock] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [isTopPriority, setIsTopPriority] = useState(false);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Custom Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Collect all unique tags across existing tasks for quick suggestion
  const existingTagsSuggestions = useMemo(() => {
    const all = new Set<string>();
    tasks.forEach((t) => {
      t.tags?.forEach((tag) => all.add(tag));
    });
    // Add some common Persian productivity tag presets
    ['فوری', 'جلسه', 'گزارش', 'پروژه', 'مطالعه', 'مهم'].forEach((t) => all.add(t));
    return Array.from(all);
  }, [tasks]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setCategory(taskToEdit.category || categories[0]?.id || 'work');
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate || selectedDate);
      setTimeBlock(taskToEdit.timeBlock || '');
      setEstimatedMinutes(taskToEdit.estimatedMinutes || 30);
      setIsTopPriority(taskToEdit.isTopPriority || false);
      setSubtasks(taskToEdit.subtasks || []);
      setTags(taskToEdit.tags || []);
      setTagInput('');
    } else {
      setTitle('');
      setDescription('');
      setCategory(categories[0]?.id || 'work');
      setPriority('medium');
      setDueDate(selectedDate);
      setTimeBlock('');
      setEstimatedMinutes(30);
      setIsTopPriority(false);
      setSubtasks([]);
      setTags([]);
      setTagInput('');
    }
  }, [taskToEdit, selectedDate, isOpen, categories]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#+/, '');
    if (!clean) return;
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        dueDate,
        timeBlock: timeBlock.trim() || undefined,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        isTopPriority,
        subtasks,
        tags,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        status: 'todo',
        dueDate,
        timeBlock: timeBlock.trim() || undefined,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        isTopPriority,
        subtasks,
        tags,
      });
    }

    onClose();
  };

  const selectedCategoryObj = getCategoryById(category);

  const priorities: { id: Priority; label: string; color: string }[] = [
    { id: 'high', label: 'بالا (فوری)', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
    { id: 'medium', label: 'متوسط', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' },
    { id: 'low', label: 'پایین', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {taskToEdit ? 'ویرایش وظیفه' : 'ثبت وظیفه جدید'}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              عنوان وظیفه <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: تکمیل پیش‌نویس قرارداد، پیاده‌روی عصرگاهی..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-hidden focus:border-indigo-500 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              توضیحات یا یادداشت‌ها (اختیاری)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="جزئیات بیشتر در مورد نحوه انجام کار..."
              className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-hidden focus:border-indigo-500 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  دسته‌بندی
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Tags className="w-3 h-3" />
                  <span>مدیریت دسته‌ها</span>
                </button>
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {selectedCategoryObj && (
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: selectedCategoryObj.color }}
                  />
                  <span>رنگ برچسب: {selectedCategoryObj.name}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  سطح اولویت و اهمیت
                </label>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                  {priority === 'high' ? 'High' : priority === 'medium' ? 'Medium' : 'Low'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                {[
                  {
                    id: 'low',
                    label: 'پایین',
                    sublabel: 'Low',
                    activeClass: 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-xs',
                    icon: <ArrowDown className="w-3.5 h-3.5" />,
                  },
                  {
                    id: 'medium',
                    label: 'متوسط',
                    sublabel: 'Medium',
                    activeClass: 'bg-white dark:bg-neutral-900 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800 shadow-xs',
                    icon: <Minus className="w-3.5 h-3.5" />,
                  },
                  {
                    id: 'high',
                    label: 'بالا',
                    sublabel: 'High',
                    activeClass: 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 shadow-xs',
                    icon: <ArrowUp className="w-3.5 h-3.5" />,
                  },
                ].map((p) => {
                  const isSelected = priority === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPriority(p.id as Priority)}
                      className={`py-1 px-1.5 rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer text-xs ${
                        isSelected
                          ? `${p.activeClass} font-semibold`
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {p.icon}
                      <span>{p.label}</span>
                      <span className="text-[9px] opacity-70 font-mono">({p.sublabel})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Date & Time Estimates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                تاریخ موعد
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                بازه زمانی (اختیاری)
              </label>
              <input
                type="text"
                placeholder="مثلاً 10:00 - 11:30"
                value={timeBlock}
                onChange={(e) => setTimeBlock(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                تخمین زمان (دقیقه)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 tabular-nums"
              />
            </div>
          </div>

          {/* Top Priority Checkbox */}
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <input
              type="checkbox"
              id="top-priority-checkbox"
              checked={isTopPriority}
              onChange={(e) => setIsTopPriority(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded-md border-neutral-300 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="top-priority-checkbox" className="text-xs font-medium text-amber-900 dark:text-amber-200 cursor-pointer">
              قرارگیری در فهرست ۳ اولویت کلیدی روز (Top 3 Focus)
            </label>
          </div>

          {/* Custom Tags Section */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>برچسب‌های سفارشی (Tags & Labels)</span>
              </label>
              {tags.length > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-neutral-400">
                  {toPersianDigits(tags.length)} برچسب
                </span>
              )}
            </div>

            {/* Input to type new tag */}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono select-none">
                  #
                </span>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddTag();
                    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
                      handleRemoveTag(tags[tags.length - 1]);
                    }
                  }}
                  placeholder="نوشتن برچسب دلخواه (مثلاً: فوری، گزارش، پیگیری...) و فشردن اینتر"
                  className="w-full pr-7 pl-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن برچسب</span>
              </button>
            </div>

            {/* Selected Tags Chips */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 p-0.5 rounded-xs transition-colors cursor-pointer"
                      title="حذف برچسب"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick suggested tags from existing tasks */}
            {existingTagsSuggestions.filter((st) => !tags.includes(st)).length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                <span>پیشنهادی:</span>
                {existingTagsSuggestions
                  .filter((st) => !tags.includes(st))
                  .slice(0, 7)
                  .map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => {
                        if (!tags.includes(suggestion)) {
                          setTags([...tags, suggestion]);
                        }
                      }}
                      className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800/70 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
                    >
                      +{suggestion}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Subtasks Section */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              زیروظایف و چک‌لیست ({subtasks.length})
            </label>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="افزودن گام یا زیروظیفه..."
                className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن</span>
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          st.completed ? 'text-emerald-500' : 'text-neutral-300 dark:text-neutral-600'
                        }`}
                      />
                      <span className={st.completed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200'}>
                        {st.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-neutral-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {taskToEdit ? 'ذخیره تغییرات' : 'ایجاد وظیفه'}
            </button>
          </div>
        </form>
      </div>

      {/* Category Manager Modal embedded */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelectCategory={(newCatId) => {
          setCategory(newCatId);
        }}
      />
    </div>
  );
};
