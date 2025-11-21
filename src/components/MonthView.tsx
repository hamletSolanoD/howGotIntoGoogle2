import React from 'react';
import { ChevronLeft, ChevronRight, Flame, Target } from 'lucide-react';
import { type ProgressData } from '../lib/types';
import { DAYS_ES, MONTHS_ES, formatDate } from '../lib/cycles';

interface MonthViewProps {
  year: number;
  month: number;
  progress: ProgressData;
  onDayClick: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;
}

export default function MonthView({ year, month, progress, onDayClick, onMonthChange }: MonthViewProps) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: (Date | null)[] = Array(startPadding).fill(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (month === 11) {
        onMonthChange(year + 1, 0);
      } else {
        onMonthChange(year, month + 1);
      }
    } else {
      if (month === 0) {
        onMonthChange(year - 1, 11);
      } else {
        onMonthChange(year, month - 1);
      }
    }
  };

  const getIntensity = (completed: number): string => {
    if (completed === 0) return 'bg-gray-800/50 border-gray-700/30';
    if (completed <= 2) return 'bg-purple-900/50 border-purple-700/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
    if (completed <= 4) return 'bg-purple-700/60 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]';
    if (completed < 6) return 'bg-lime-700/60 border-lime-500/60 shadow-[0_0_15px_rgba(163,230,53,0.3)]';
    return 'bg-lime-500/70 border-lime-400/80 shadow-[0_0_25px_rgba(163,230,53,0.5)]';
  };

  const monthStats = days.filter(d => d !== null).reduce(
    (acc, date) => {
      if (!date) return acc;
      const dateStr = formatDate(date);
      const dayData = progress.days[dateStr];
      if (!dayData) return acc;
      
      const completed = dayData.problems.filter(p => p.completed).length;
      return {
        totalCompleted: acc.totalCompleted + completed,
        daysWithProgress: completed > 0 ? acc.daysWithProgress + 1 : acc.daysWithProgress,
        perfectDays: completed === 6 ? acc.perfectDays + 1 : acc.perfectDays
      };
    },
    { totalCompleted: 0, daysWithProgress: 0, perfectDays: 0 }
  );

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigateMonth('prev')}
          className="rounded-xl border-2 border-purple-500/30 bg-gray-900/60 p-3 text-purple-300 backdrop-blur-sm transition-all hover:border-purple-400 hover:bg-purple-950/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight text-white">
            {MONTHS_ES[month]}
          </h2>
          <p className="text-lg text-gray-400">{year}</p>
        </div>

        <button
          onClick={() => navigateMonth('next')}
          className="rounded-xl border-2 border-purple-500/30 bg-gray-900/60 p-3 text-purple-300 backdrop-blur-sm transition-all hover:border-purple-400 hover:bg-purple-950/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-gray-900/60 to-purple-950/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-400">
            <Target className="h-4 w-4" />
            Problemas
          </div>
          <div className="text-4xl font-black text-white">
            {monthStats.totalCompleted}
          </div>
          <div className="mt-1 text-xs text-gray-400">completados este mes</div>
        </div>

        <div className="rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-gray-900/60 to-cyan-950/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-cyan-400">
            <Flame className="h-4 w-4" />
            Días activos
          </div>
          <div className="text-4xl font-black text-white">
            {monthStats.daysWithProgress}
          </div>
          <div className="mt-1 text-xs text-gray-400">días con progreso</div>
        </div>

        <div className="rounded-2xl border-2 border-lime-500/30 bg-gradient-to-br from-gray-900/60 to-lime-950/40 p-6 backdrop-blur-xl">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-lime-400">
            <Target className="h-4 w-4" />
            Días perfectos
          </div>
          <div className="text-4xl font-black text-white">
            {monthStats.perfectDays}
          </div>
          <div className="mt-1 text-xs text-gray-400">6/6 problemas</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border-2 border-purple-500/20 bg-gradient-to-br from-gray-900/60 to-purple-950/30 p-6 backdrop-blur-xl">
        <div className="mb-4 grid grid-cols-7 gap-2">
          {DAYS_ES.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-black uppercase tracking-wider text-purple-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = formatDate(date);
            const dayData = progress.days[dateStr];
            const completed = dayData ? dayData.problems.filter(p => p.completed).length : 0;
            const isToday = isCurrentMonth && date.getDate() === today.getDate();
            const isPerfect = completed === 6;

            return (
              <button
                key={dateStr}
                onClick={() => onDayClick(date)}
                className={`group relative aspect-square overflow-hidden rounded-xl border-2 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:z-10 ${
                  getIntensity(completed)
                } ${isToday ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-950' : ''}`}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <div className={`text-lg font-bold ${
                    completed === 0 ? 'text-gray-500' :
                    completed < 6 ? 'text-purple-200' :
                    'text-lime-200'
                  }`}>
                    {date.getDate()}
                  </div>
                  {completed > 0 && (
                    <div className={`text-[10px] font-bold ${
                      isPerfect ? 'text-lime-300' : 'text-purple-300'
                    }`}>
                      {completed}/6
                    </div>
                  )}
                </div>

                {isPerfect && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-lime-400/20 to-green-400/20" />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/95 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="text-center">
                    <div className="text-xs font-bold text-white">
                      {completed}/6
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {dayData?.theme.split(',')[0] || 'Sin datos'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-gray-700/30 bg-gray-800/50" />
          <span className="text-gray-400">0 problemas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-purple-700/50 bg-purple-900/50" />
          <span className="text-gray-400">1-2 problemas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-purple-500/60 bg-purple-700/60" />
          <span className="text-gray-400">3-4 problemas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-lime-500/60 bg-lime-700/60" />
          <span className="text-gray-400">5 problemas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-lime-400/80 bg-lime-500/70" />
          <span className="text-gray-400">6 problemas</span>
        </div>
      </div>
    </div>
  );
}