/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DailyManagerProvider, useDailyManager } from './context/DailyManagerContext';
import { Header } from './components/Header';
import { DateSelector } from './components/DateSelector';
import { OverviewTab } from './components/OverviewTab';
import { TimelineTab } from './components/TimelineTab';
import { TasksTab } from './components/TasksTab';
import { HabitsTab } from './components/HabitsTab';
import { PomodoroTab } from './components/PomodoroTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import HediAIPage from './features/hedi-ai/HediAIPage';
import { TaskModal } from './components/TaskModal';
import { TimelineModal } from './components/TimelineModal';
import { HabitModal } from './components/HabitModal';
import { Task, Habit } from './types';

const MainApp: React.FC = () => {
  const { activeTab } = useDailyManager();

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);

  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewHabit = () => {
    setHabitToEdit(null);
    setIsHabitModalOpen(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsHabitModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top 3-Zone Navigation */}
      <Header onOpenNewTaskModal={handleOpenNewTask} />

      {/* Date & Day Progress Bar */}
      <DateSelector />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewTab
            onOpenNewTaskModal={handleOpenNewTask}
            onOpenNewSlotModal={() => setIsTimelineModalOpen(true)}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab onOpenNewSlotModal={() => setIsTimelineModalOpen(true)} />
        )}

        {activeTab === 'tasks' && (
          <TasksTab onOpenNewTaskModal={handleOpenNewTask} onEditTask={handleEditTask} />
        )}

        {activeTab === 'habits' && (
          <HabitsTab onOpenNewHabitModal={handleOpenNewHabit} onEditHabit={handleEditHabit} />
        )}

        {activeTab === 'pomodoro' && <PomodoroTab />}

        {activeTab === 'analytics' && <AnalyticsTab />}

        {activeTab === 'hedi' && <HediAIPage />}
      </main>

      {/* Clean quiet footer */}
      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500 dark:text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>مدیریار · سامانه شخصی مدیریت زمان، روتین‌ها و وظایف روزانه</span>
          <span>همه اطلاعات به صورت خودکار و امن در حافظه مرورگر شما ذخیره می‌شود</span>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <TimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => setIsTimelineModalOpen(false)}
      />

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        habitToEdit={habitToEdit}
      />
    </div>
  );
};

export default function App() {
  return (
    <DailyManagerProvider>
      <MainApp />
    </DailyManagerProvider>
  );
}
