import React, { useState } from 'react';
import { Check, Link2, ExternalLink, BookOpen, Target, Zap, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { ProgressData, Problem } from '../lib/types';
import { DAYS_FULL_ES, MONTHS_ES, getCycleDay, THEME_DETAILS, formatDate } from '../lib/cycles';
import ProblemModal from './ProblemModal';

interface DayViewProps {
  date: Date;
  progress: ProgressData;
  onUpdateProblem: (date: Date, problemId: number, updates: Partial<Problem>) => void;
  onDateChange: (date: Date) => void;
}

export default function DayView({ date, progress, onUpdateProblem, onDateChange }: DayViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const dateStr = formatDate(date);
  const dayProgress = progress.days[dateStr] || {
    date: dateStr,
    theme: '',
    problems: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, completed: false }))
  };

  const completedCount = dayProgress.problems.filter(p => p.completed).length;
  const cycleDay = getCycleDay(date);
  const themeDetail = THEME_DETAILS[dayProgress.theme];
  const isToday = date.toDateString() === new Date().toDateString();

  const handleToggleComplete = (problem: Problem) => {
    if (!problem.completed) {
      setSelectedProblem(problem);
      setModalOpen(true);
    } else {
      onUpdateProblem(date, problem.id, { completed: false, link: undefined, completedAt: undefined });
    }
  };

  const handleSaveLink = (link: string) => {
    if (selectedProblem) {
      onUpdateProblem(date, selectedProblem.id, {
        completed: true,
        link: link || undefined,
        completedAt: new Date().toISOString()
      });
    }
  };

  const handleEditLink = (problem: Problem) => {
    setSelectedProblem(problem);
    setModalOpen(true);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    onDateChange(newDate);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigateDay('prev')}
          className="rounded-xl border-2 border-purple-500/30 bg-gray-900/60 p-3 text-purple-300 backdrop-blur-sm transition-all hover:border-purple-400 hover:bg-purple-950/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h2 className="text-4xl font-black uppercase tracking-tight text-white">
              {DAYS_FULL_ES[date.getDay() === 0 ? 6 : date.getDay() - 1]}
            </h2>
          </div>
          <p className="text-lg text-gray-400">
            {date.getDate()} de {MONTHS_ES[date.getMonth()]} {date.getFullYear()}
          </p>
          {isToday && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-950/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Zap className="h-3 w-3" />
              Hoy
            </div>
          )}
        </div>

        <button
          onClick={() => navigateDay('next')}
          className="rounded-xl border-2 border-purple-500/30 bg-gray-900/60 p-3 text-purple-300 backdrop-blur-sm transition-all hover:border-purple-400 hover:bg-purple-950/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-gray-900/80 to-purple-950/40 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.2)]">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-400">
              <BookOpen className="h-4 w-4" />
              Tema del día
            </div>
            <h3 className="text-3xl font-black text-white">
              {dayProgress.theme}
            </h3>
          </div>
          <div className="rounded-xl border-2 border-cyan-500/50 bg-cyan-950/40 px-4 py-2 text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Ciclo</div>
            <div className="text-2xl font-black text-cyan-300">Día {cycleDay}</div>
          </div>
        </div>

        {themeDetail && (
          <>
            <p className="mb-4 text-sm leading-relaxed text-gray-300">
              {themeDetail.description}
            </p>

            <div className="mb-4 rounded-xl border border-purple-500/30 bg-purple-950/20 p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                Problemas clave
              </div>
              <div className="grid grid-cols-2 gap-2">
                {themeDetail.keyProblems.map((prob, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {prob}
                  </div>
                ))}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-400">
              <Target className="h-3 w-3" />
              {themeDetail.difficulty}
            </div>
          </>
        )}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-2xl font-black uppercase tracking-tight text-white">
          Problemas de hoy
        </h4>
        <div className="text-sm font-bold text-gray-400">
          {completedCount}/6 completados
        </div>
      </div>

      <div className="space-y-4">
        {dayProgress.problems.map((problem) => (
          <div
            key={problem.id}
            className={`group relative overflow-hidden rounded-2xl border-2 p-6 backdrop-blur-xl transition-all duration-300 ${
              problem.completed
                ? 'border-lime-400/60 bg-gradient-to-r from-lime-950/60 to-green-950/60 shadow-[0_0_30px_rgba(163,230,53,0.3)]'
                : 'border-purple-500/20 bg-gradient-to-r from-gray-900/60 to-purple-950/30 hover:border-purple-400/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => handleToggleComplete(problem)}
                className={`mt-1 flex-shrink-0 rounded-xl border-2 p-3 transition-all ${
                  problem.completed
                    ? 'border-lime-400 bg-lime-950/50 text-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.4)]'
                    : 'border-gray-700 bg-gray-900/60 text-gray-500 hover:border-purple-500 hover:bg-purple-950/40 hover:text-purple-300'
                }`}
              >
                <Check className="h-6 w-6" strokeWidth={3} />
              </button>

              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h5 className="text-xl font-bold text-white">
                    Problema {problem.id}
                  </h5>
                  {problem.completed && problem.completedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(problem.completedAt).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>

                {problem?.url && (
                  <a
                    href={problem?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2 inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 text-sm font-medium text-cyan-300 transition-all hover:border-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="max-w-md truncate">{problem?.url}</span>
                  </a>
                )}

                {problem.completed && (
                  <button
                    onClick={() => handleEditLink(problem)}
                    className="inline-flex items-center gap-2 rounded-lg border border-purple-500/40 bg-purple-950/30 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300 transition-all hover:border-purple-400 hover:bg-purple-950/50"
                  >
                    <Link2 className="h-3 w-3" />
                    {problem.link ? 'Editar link' : 'Agregar link'}
                  </button>
                )}
              </div>
            </div>

            {problem.completed && (
              <div className="absolute inset-0 bg-gradient-to-r from-lime-500/5 via-green-500/5 to-transparent animate-pulse pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      <ProblemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        problemNumber={selectedProblem?.id || 0}
        currentLink={selectedProblem?.link}
        onSave={handleSaveLink}
        theme={dayProgress.theme}
      />
    </div>
  );
}