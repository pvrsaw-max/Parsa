import { useDailyManager } from '../../context/DailyManagerContext';

export default function DashboardPage(){
 const { tasks, habits } = useDailyManager();

 return (
  <div className="space-y-4">
   <h1 className="text-2xl font-bold">داشبورد Hedi Life 🌷</h1>
   <div className="grid gap-4 md:grid-cols-2">
    <div className="rounded-xl border p-4">وظایف فعال: {tasks.length}</div>
    <div className="rounded-xl border p-4">عادت‌ها: {habits.length}</div>
   </div>
  </div>
 );
}
