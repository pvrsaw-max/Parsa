import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Task, Habit, TimelineSlot, DailyLog, ActiveTab, MoodType, TaskCategory, DEFAULT_TASK_CATEGORIES } from '../types';
import { INITIAL_TASKS, INITIAL_HABITS, INITIAL_TIMELINE, INITIAL_DAILY_LOGS } from '../data/initialData';
import { toISODate } from '../utils/jalali';

interface DailyManagerContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  tasks: Task[];
  filteredTasksForDate: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  categories: TaskCategory[];
  addCategory: (cat: Omit<TaskCategory, 'id'>) => TaskCategory;
  updateCategory: (id: string, updates: Partial<TaskCategory>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => TaskCategory;
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitForDate: (habitId: string, date: string) => void;
  timelineSlots: TimelineSlot[];
  slotsForSelectedDate: TimelineSlot[];
  addTimelineSlot: (slot: Omit<TimelineSlot, 'id'>) => void;
  updateTimelineSlot: (id: string, updates: Partial<TimelineSlot>) => void;
  deleteTimelineSlot: (id: string) => void;
  toggleTimelineSlot: (id: string) => void;
  currentDailyLog: DailyLog;
  updateDailyLog: (updates: Partial<DailyLog>) => void;
  incrementWater: () => void;
  decrementWater: () => void;
  setMood: (mood: MoodType | null) => void;
  addPomodoroSession: (minutes: number) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetToSampleData: () => void;
}

const DailyManagerContext = createContext<DailyManagerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'modiryar_tasks_v1',
  HABITS: 'modiryar_habits_v1',
  TIMELINE: 'modiryar_timeline_v1',
  LOGS: 'modiryar_daily_logs_v1',
  THEME: 'modiryar_theme_v1',
  CATEGORIES: 'modiryar_categories_v1',
};

export const DailyManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todayStr = useMemo(() => toISODate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  // Categories state
  const [categories, setCategories] = useState<TaskCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_TASK_CATEGORIES;
    } catch {
      return DEFAULT_TASK_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  const addCategory = (catData: Omit<TaskCategory, 'id'>): TaskCategory => {
    const newCat: TaskCategory = {
      ...catData,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<TaskCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Reassign tasks that had this category to 'personal' or 'work'
    setTasks((prev) =>
      prev.map((t) => (t.category === id ? { ...t, category: 'personal' } : t))
    );
  };

  const getCategoryById = (id: string): TaskCategory => {
    const found = categories.find((c) => c.id === id);
    if (found) return found;
    return (
      DEFAULT_TASK_CATEGORIES.find((c) => c.id === id) || {
        id,
        name: id,
        color: '#64748B',
        bgColor: 'bg-slate-50 dark:bg-slate-900',
        textColor: 'text-slate-700 dark:text-slate-300',
        borderColor: 'border-slate-200 dark:border-slate-800',
      }
    );
  };

  // Habits state
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error(e);
    }
  }, [habits]);

  // Timeline slots state
  const [timelineSlots, setTimelineSlots] = useState<TimelineSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMELINE);
      return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
    } catch {
      return INITIAL_TIMELINE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timelineSlots));
    } catch (e) {
      console.error(e);
    }
  }, [timelineSlots]);

  // Daily logs state
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
    } catch {
      return INITIAL_DAILY_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(dailyLogs));
    } catch (e) {
      console.error(e);
    }
  }, [dailyLogs]);

  // Current log for selected date
  const currentDailyLog = useMemo<DailyLog>(() => {
    return (
      dailyLogs[selectedDate] || {
        date: selectedDate,
        waterGlasses: 0,
        mood: null,
        reflectionNotes: '',
        gratitude: '',
        pomodoroSessionsCompleted: 0,
        focusMinutes: 0,
      }
    );
  }, [dailyLogs, selectedDate]);

  const updateDailyLog = (updates: Partial<DailyLog>) => {
    setDailyLogs((prev) => {
      const current = prev[selectedDate] || {
        date: selectedDate,
        waterGlasses: 0,
        mood: null,
        reflectionNotes: '',
        gratitude: '',
        pomodoroSessionsCompleted: 0,
        focusMinutes: 0,
      };
      return {
        ...prev,
        [selectedDate]: { ...current, ...updates },
      };
    });
  };

  const incrementWater = () => {
    updateDailyLog({ waterGlasses: Math.min(16, currentDailyLog.waterGlasses + 1) });
  };

  const decrementWater = () => {
    updateDailyLog({ waterGlasses: Math.max(0, currentDailyLog.waterGlasses - 1) });
  };

  const setMood = (mood: MoodType | null) => {
    updateDailyLog({ mood });
  };

  const addPomodoroSession = (minutes: number) => {
    updateDailyLog({
      pomodoroSessionsCompleted: currentDailyLog.pomodoroSessionsCompleted + 1,
      focusMinutes: currentDailyLog.focusMinutes + minutes,
    });
  };

  // Task actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: todayStr,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'completed' && t.status !== 'completed') {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: newSubtasks };
        }
        return t;
      })
    );
  };

  // Habits actions
  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      streak: 0,
      completedDates: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleHabitForDate = (habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isCompleted = h.completedDates.includes(date);
          const newDates = isCompleted
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date];

          // Re-calculate streak
          let currentStreak = 0;
          const checkDate = new Date();
          // check if completed today or yesterday
          const dStr = toISODate(checkDate);
          let testDate = new Date(checkDate);
          
          if (!newDates.includes(dStr)) {
            testDate.setDate(testDate.getDate() - 1);
          }

          while (true) {
            const formatted = toISODate(testDate);
            if (newDates.includes(formatted)) {
              currentStreak++;
              testDate.setDate(testDate.getDate() - 1);
            } else {
              break;
            }
          }

          return {
            ...h,
            completedDates: newDates,
            streak: currentStreak,
          };
        }
        return h;
      })
    );
  };

  // Timeline actions
  const addTimelineSlot = (slotData: Omit<TimelineSlot, 'id'>) => {
    const newSlot: TimelineSlot = {
      ...slotData,
      id: `slot-${Date.now()}`,
    };
    setTimelineSlots((prev) =>
      [...prev, newSlot].sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
  };

  const updateTimelineSlot = (id: string, updates: Partial<TimelineSlot>) => {
    setTimelineSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)).sort((a, b) => a.startTime.localeCompare(b.startTime))
    );
  };

  const deleteTimelineSlot = (id: string) => {
    setTimelineSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleTimelineSlot = (id: string) => {
    setTimelineSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  // Filtered lists for selected date
  const filteredTasksForDate = useMemo(() => {
    return tasks.filter((t) => t.dueDate === selectedDate || !t.dueDate);
  }, [tasks, selectedDate]);

  const slotsForSelectedDate = useMemo(() => {
    return timelineSlots
      .filter((s) => s.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timelineSlots, selectedDate]);

  // Export / Import / Reset
  const exportData = () => {
    const data = {
      tasks,
      categories,
      habits,
      timelineSlots,
      dailyLogs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modiryar-backup-${selectedDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.tasks && Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (parsed.categories && Array.isArray(parsed.categories)) setCategories(parsed.categories);
      if (parsed.habits && Array.isArray(parsed.habits)) setHabits(parsed.habits);
      if (parsed.timelineSlots && Array.isArray(parsed.timelineSlots)) setTimelineSlots(parsed.timelineSlots);
      if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
      return true;
    } catch {
      return false;
    }
  };

  const resetToSampleData = () => {
    setTasks(INITIAL_TASKS);
    setCategories(DEFAULT_TASK_CATEGORIES);
    setHabits(INITIAL_HABITS);
    setTimelineSlots(INITIAL_TIMELINE);
    setDailyLogs(INITIAL_DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
  };

  return (
    <DailyManagerContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        tasks,
        filteredTasksForDate,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        toggleSubtask,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitForDate,
        timelineSlots,
        slotsForSelectedDate,
        addTimelineSlot,
        updateTimelineSlot,
        deleteTimelineSlot,
        toggleTimelineSlot,
        currentDailyLog,
        updateDailyLog,
        incrementWater,
        decrementWater,
        setMood,
        addPomodoroSession,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        exportData,
        importData,
        resetToSampleData,
      }}
    >
      {children}
    </DailyManagerContext.Provider>
  );
};

export const useDailyManager = () => {
  const context = useContext(DailyManagerContext);
  if (!context) {
    throw new Error('useDailyManager must be used within DailyManagerProvider');
  }
  return context;
};
