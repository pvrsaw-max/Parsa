export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  isSystem?: boolean;
}

export const DEFAULT_TASK_CATEGORIES: TaskCategory[] = [
  {
    id: 'work',
    name: 'کاری و شغلی',
    color: '#4F46E5',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    isSystem: true,
  },
  {
    id: 'personal',
    name: 'شخصی و زندگی',
    color: '#0D9488',
    bgColor: 'bg-teal-50 dark:bg-teal-950/40',
    textColor: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-200 dark:border-teal-800',
    isSystem: true,
  },
  {
    id: 'health',
    name: 'سلامت و ورزش',
    color: '#16A34A',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    isSystem: true,
  },
  {
    id: 'learning',
    name: 'یادگیری و مهارت',
    color: '#D97706',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
    isSystem: true,
  },
  {
    id: 'finance',
    name: 'مالی و اداری',
    color: '#0284C7',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    textColor: 'text-sky-700 dark:text-sky-300',
    borderColor: 'border-sky-200 dark:border-sky-800',
    isSystem: true,
  },
];

export type Category = string;

export type Priority = 'low' | 'medium' | 'high';

export interface PriorityOption {
  id: Priority;
  label: string;
  englishLabel: string;
  description: string;
  weight: number;
  color: string;
  badgeClass: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    id: 'low',
    label: 'پایین',
    englishLabel: 'Low',
    description: 'کارهای غیرفوری و منعطف',
    weight: 1,
    color: '#16A34A',
    badgeClass: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'medium',
    label: 'متوسط',
    englishLabel: 'Medium',
    description: 'کارهای روزمره با اهمیت عادی',
    weight: 2,
    color: '#D97706',
    badgeClass: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'high',
    label: 'بالا',
    englishLabel: 'High',
    description: 'کارهای فوری و حیاتی',
    weight: 3,
    color: '#DC2626',
    badgeClass: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  },
];

export function getPriorityWeight(p: Priority): number {
  switch (p) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
    default:
      return 1;
  }
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  timeBlock?: string; // e.g. "09:00 - 10:30"
  estimatedMinutes: number;
  actualMinutes?: number;
  isTopPriority?: boolean; // Top priority item for today
  subtasks: Subtask[];
  tags?: string[]; // Custom tags or labels e.g. ['فوری', 'گزارش']
  createdAt: string;
  completedAt?: string;
}

export type HabitPeriod = 'morning' | 'afternoon' | 'evening';
export type HabitCategory = 'health' | 'mind' | 'productivity' | 'learning';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  period: HabitPeriod;
  streak: number;
  completedDates: string[]; // List of YYYY-MM-DD dates
  targetDaysPerWeek: number;
  notes?: string;
}

export type TimelineType = 'work' | 'meeting' | 'break' | 'exercise' | 'focus' | 'personal';

export interface TimelineSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "HH:MM" e.g. "08:30"
  endTime: string; // "HH:MM" e.g. "10:00"
  title: string;
  type: TimelineType;
  completed: boolean;
  notes?: string;
}

export type MoodType = 'great' | 'good' | 'neutral' | 'tired' | 'stressed';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  waterGlasses: number; // Target 8
  mood: MoodType | null;
  reflectionNotes: string;
  gratitude: string;
  pomodoroSessionsCompleted: number;
  focusMinutes: number;
}

export type ActiveTab = 'overview' | 'timeline' | 'tasks' | 'habits' | 'pomodoro' | 'analytics' | 'hedi';
