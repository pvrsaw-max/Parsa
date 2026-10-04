import React, { useState } from 'react';
import { useDailyManager } from '../context/DailyManagerContext';
import { TaskCategory } from '../types';
import { toPersianDigits } from '../utils/jalali';
import { X, Plus, Edit2, Trash2, Check, Tags } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (categoryId: string) => void;
}

const COLOR_PRESETS = [
  {
    name: 'نیلی',
    color: '#4F46E5',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
  },
  {
    name: 'یشمی',
    color: '#0D9488',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40',
    textColor: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-200 dark:border-teal-800',
  },
  {
    name: 'زمردی',
    color: '#16A34A',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    name: 'کهربایی',
    color: '#D97706',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  {
    name: 'رز / قرمز',
    color: '#E11D48',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    textColor: 'text-rose-700 dark:text-rose-300',
    borderColor: 'border-rose-200 dark:border-rose-800',
  },
  {
    name: 'بنفش',
    color: '#7C3AED',
    bgColor: 'bg-violet-50 dark:bg-violet-950/40',
    textColor: 'text-violet-700 dark:text-violet-300',
    borderColor: 'border-violet-200 dark:border-violet-800',
  },
  {
    name: 'آبی آسمانی',
    color: '#0284C7',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-800',
  },
  {
    name: 'نارنجی',
    color: '#EA580C',
    bgColor: 'bg-orange-50 dark:bg-orange-950/40',
    textColor: 'text-orange-700 dark:text-orange-300',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  {
    name: 'ارغوانی',
    color: '#C026D3',
    bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/40',
    textColor: 'text-fuchsia-700 dark:text-fuchsia-300',
    borderColor: 'border-fuchsia-200 dark:border-fuchsia-800',
  },
];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const { categories, addCategory, updateCategory, deleteCategory, tasks } = useDailyManager();

  const [isCreating, setIsCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setName('');
    setSelectedPresetIndex(0);
    setEditingCategoryId(null);
    setIsCreating(true);
  };

  const handleStartEdit = (cat: TaskCategory) => {
    setIsCreating(false);
    setEditingCategoryId(cat.id);
    setName(cat.name);
    const foundIndex = COLOR_PRESETS.findIndex((p) => p.color === cat.color);
    setSelectedPresetIndex(foundIndex >= 0 ? foundIndex : 0);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const preset = COLOR_PRESETS[selectedPresetIndex];

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: name.trim(),
        color: preset.color,
        bgColor: preset.bgColor,
        textColor: preset.textColor,
        borderColor: preset.borderColor,
      });
      setEditingCategoryId(null);
    } else {
      const created = addCategory({
        name: name.trim(),
        color: preset.color,
        bgColor: preset.bgColor,
        textColor: preset.textColor,
        borderColor: preset.borderColor,
      });
      if (onSelectCategory) {
        onSelectCategory(created.id);
      }
      setIsCreating(false);
    }

    setName('');
  };

  const handleDelete = (id: string, catName: string) => {
    const count = tasks.filter((t) => t.category === id).length;
    let message = `آیا از حذف دسته‌بندی «${catName}» اطمینان دارید؟`;
    if (count > 0) {
      message += ` (${toPersianDigits(count)} وظیفه در این دسته قرار دارد که به دسته‌بندی پیش‌فرض منتقل خواهند شد)`;
    }
    if (window.confirm(message)) {
      deleteCategory(id);
      if (editingCategoryId === id) {
        setEditingCategoryId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
              مدیریت دسته‌بندی‌های وظایف
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Create or Edit Form */}
          {(isCreating || editingCategoryId) && (
            <form
              onSubmit={handleSaveCategory}
              className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {editingCategoryId ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCategoryId(null);
                  }}
                  className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                >
                  انصراف
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  نام دسته‌بندی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: پروژه الف، خانه و خانواده، خرید..."
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  رنگ برچسب
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset, idx) => {
                    const isSelected = selectedPresetIndex === idx;
                    return (
                      <button
                        type="button"
                        key={preset.color}
                        onClick={() => setSelectedPresetIndex(idx)}
                        style={{ backgroundColor: preset.color }}
                        title={preset.name}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                          isSelected ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-sm' : 'opacity-85 hover:opacity-100'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {editingCategoryId ? 'بروزرسانی دسته‌بندی' : 'ایجاد دسته‌بندی'}
                </button>
              </div>
            </form>
          )}

          {/* Action button if not currently creating/editing */}
          {!isCreating && !editingCategoryId && (
            <button
              onClick={handleStartCreate}
              className="w-full py-2.5 px-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن دسته‌بندی تازه</span>
            </button>
          )}

          {/* Existing Categories List */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              دسته‌بندی‌های فعال ({toPersianDigits(categories.length)})
            </span>

            <div className="space-y-2">
              {categories.map((cat) => {
                const count = tasks.filter((t) => t.category === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: cat.color }}
                      />
                      <div>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                          {cat.name}
                        </span>
                        <div className="text-[11px] text-neutral-400 font-mono tabular-nums">
                          {toPersianDigits(count)} وظیفه
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {onSelectCategory && (
                        <button
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onClose();
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-md transition-colors cursor-pointer ml-1"
                        >
                          انتخاب
                        </button>
                      )}

                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-md transition-colors cursor-pointer"
                        title="ویرایش نام و رنگ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Don't allow deleting if only 1 category remains */}
                      {categories.length > 1 && (
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                          title="حذف دسته‌بندی"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
