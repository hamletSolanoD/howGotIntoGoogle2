import React from 'react';
import { Check, Sparkles, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgressData, Problem } from '../lib/types';
import { DAYS_ES, getWeekDates, formatDate, getThemeForDate, MONTHS_ES } from '../lib/cycles';

interface WeekViewProps {
  referenceDate: Date;
  progress: ProgressData;
  onUpdateProblem: (date: Date, problemId: number, updates: Partial<Problem>) => void;
  onDayClick: (date: Date) => void;
  onWeekChange: (date: Date) => void;
}

interface DayColumnProps {
  date: Date;
  dayName: string;
  theme: string;
  completed: boolean[];
  onToggle: (index: number) => void;
  onClick: () => void;
}

const DayColumn: React.FC<DayColumnProps> = ({ date, dayName, theme, completed, onToggle, onClick }) => {
  const isToday = date.toDateString() === new Date().toDateString();
  const completedCount = completed.filter(Boolean).length;
  const allCompleted = completedCount === 6;

  return (
    <div 
      className={`group relative flex cursor-pointer flex-col rounded-3xl border-2 p-5 backdrop-blur-xl transition-all duration-500 ${
        isToday 
          ? 'border-cyan-400/60 bg-gradient-to-b from-cyan-950/40 to-purple-950/40 shadow-[0_0_40px_rgba(34,211,238,0.4),inset_0_0_60px_rgba(34,211,238,0.1)]' 
          : 'border-purple-500/20 bg-gradient-to-b from-gray-900/60 to-purple-950/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
      } hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(168,85,247,0.4)]`}
      onClick={onClick}
    >
      {isToday && (
        <div className="absolute -top-1 -left-1 -right-1 -bottom-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />
      )}

      <div className="relative mb-4 text-center">
        <div className={`mb-2 flex items-center justify-center gap-2 text-sm font-black tracking-[0.2em] ${
          isToday ? 'text-cyan-300' : 'text-purple-300'
        }`}>
          {isToday && <Sparkles className="h-4 w-4 animate-pulse" />}
          {dayName}
          {isToday && <Sparkles className="h-4 w-4 animate-pulse" />}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
          <div className="h-px w-3 bg-gradient-to-r from-transparent to-purple-500" />
          {date.getDate()}/{date.getMonth() + 1}
          <div className="h-px w-3 bg-gradient-to-l from-transparent to-purple-500" />
        </div>
      </div>

      <div className="relative mb-5 flex-1">
        <div className={`relative overflow-hidden rounded-2xl border p-3 text-center text-xs font-bold uppercase leading-tight tracking-wide backdrop-blur-sm ${
          isToday 
            ? 'border-cyan-400/50 bg-gradient-to-br from-cyan-950/60 to-blue-950/60 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.3),inset_0_0_40px_rgba(34,211,238,0.1)]' 
            : 'border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-pink-950/30 text-purple-200 shadow-[inset_0_0_30px_rgba(168,85,247,0.1)]'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="relative text-[10px] leading-tight">{theme}</div>
        </div>
      </div>

      <div className="relative space-y-2.5" onClick={(e) => e.stopPropagation()}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(index);
            }}
            className={`group/btn relative w-full overflow-hidden rounded-xl border-2 px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider backdrop-blur-sm transition-all duration-300 ${
              completed[index]
                ? 'border-lime-400/80 bg-gradient-to-r from-lime-950/70 to-green-950/70 text-lime-200 shadow-[0_0_20px_rgba(163,230,53,0.5),inset_0_0_30px_rgba(163,230,53,0.2)]'
                : 'border-gray-700/50 bg-gradient-to-r from-gray-900/60 to-gray-800/60 text-gray-400 hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-purple-950/40 hover:to-pink-950/40 hover:text-purple-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
            } hover:scale-[1.02]`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-between">
              <span className="text-[10px]">P{index + 1}</span>
              <div className={`flex items-center justify-center rounded-full border-2 p-1 transition-all ${
                completed[index]
                  ? 'border-lime-300 bg-lime-400/30 shadow-[0_0_10px_rgba(163,230,53,0.6)]'
                  : 'border-gray-600 bg-gray-800/50'
              }`}>
                {completed[index] && (
                  <Check className="h-3 w-3 text-lime-300" strokeWidth={3} />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="relative mt-4 text-center">
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-sm ${
          allCompleted
            ? 'border-lime-400/50 bg-lime-950/40 text-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
            : 'border-purple-500/30 bg-purple-950/30 text-purple-400'
        }`}>
          <Target className="h-3 w-3" />
          {completedCount}/6
        </div>
      </div>
    </div>
  );
};

export default function WeekView({ referenceDate, progress, onUpdateProblem, onDayClick, onWeekChange }: WeekViewProps) {
  const weekDates = getWeekDates(referenceDate);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const handleToggle = (date: Date, index: number): void => {
    const dateStr = formatDate(date);
    const dayData = progress.days[dateStr];
    
    if (dayData && dayData.problems[index]) {
      onUpdateProblem(date, index + 1, { 
        completed: !dayData.problems[index].completed,
        completedAt: !dayData.problems[index].completed ? new Date().toISOString() : undefined
      });
    } else {
      onUpdateProblem(date, index + 1, { 
        completed: true,
        completedAt: new Date().toISOString()
      });
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() + (direction === 'next' ? 7 : -7));
    onWeekChange(newDate);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigateWeek('prev')}
          className="rounded-xl border-2 border-purple-500/30 bg-gray-900/60 p-3 text-purple-300 backdrop-blur-sm transition-all hover:border-purple-400 hover:bg-purple-950/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            {weekStart.getDate()} {MONTHS_ES[weekStart.getMonth()]} - {weekEnd.getDate()} {MONTHS_ES[weekEnd.getMonth()]}
          </h2>
          <p className="text-sm text-gray-400">{weekStart.getFullYear()}</p>
        </div>

        <button
          onClick={() => navigateWeek('next')}
          className="rounded-xl border-2 border-purple-500/30 bg-gray-900/60 p-3 text-purple-300 backdrop-blur-sm transition-all hover:border-purple-400 hover:bg-purple-950/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dateStr = formatDate(date);
          const theme = getThemeForDate(dateStr);
          const dayData = progress.days[dateStr];
          const completed = dayData 
            ? dayData.problems.map(p => p.completed)
            : Array(6).fill(false);

          return (
            <DayColumn
              key={dateStr}
              date={date}
              dayName={DAYS_ES[index]}
              theme={theme}
              completed={completed}
              onToggle={(problemIndex) => handleToggle(date, problemIndex)}
              onClick={() => onDayClick(date)}
            />
          );
        })}
      </div>
    </div>
  );
}