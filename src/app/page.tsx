'use client';

import React, { useState } from 'react';
import { Calendar, CalendarDays, CalendarRange, Sparkles, Target, Flame, Download, Upload } from 'lucide-react';
import type { ViewMode } from '../lib/types';
import MonthView from '../components/MonthView';
import WeekView from '../components/WeekView';
import DayView from '../components/DayView';
import { api } from '~/trpc/react';

export default function NeetCodeTracker() {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: progress, isLoading } = api.progress.get.useQuery();
  const updateProblemMutation = api.progress.updateProblem.useMutation({
    onSuccess: () => {
      utils.progress.get.invalidate();
    },
  });

  const utils = api.useUtils();

  const handleUpdateProblem = async (date: Date, problemNumber: number, updates: { completed: boolean; link?: string }) => {
    await updateProblemMutation.mutateAsync({
      date,
      problemNumber,
      completed: updates.completed,
      link: updates.link,
    });
  };

  const handleExport = () => {
    if (!progress) return;
    
    const dataStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neetcode-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050710] flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-400 animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-[#050710] flex items-center justify-center">
        <div className="text-2xl font-bold text-red-400">
          Error al cargar el progreso
        </div>
      </div>
    );
  }

  const progressPercentage = (progress.currentTotal / progress.totalProblems) * 100;
  const daysRemaining = Math.ceil((new Date(progress.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const averageNeeded = ((progress.totalProblems - progress.currentTotal) / daysRemaining).toFixed(1);

  return (
    <div className="min-h-screen bg-[#050710] bg-gradient-to-br from-gray-950 via-purple-950/30 to-blue-950/20 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSwgOTIsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative mx-auto max-w-[1800px]">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          </div>
          
          <h1 className="mb-3 text-7xl font-black tracking-tighter">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              NEETCODE
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-purple-300/80">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500" />
            <span>Google L4 Preparation</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500" />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-gradient-to-br from-gray-900/60 to-purple-950/40 p-6 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-purple-400/50 hover:shadow-[0_0_50px_rgba(168,85,247,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-purple-300">
              <Target className="h-5 w-5" />
              Progreso Total
            </div>
            <div className="relative mb-4 text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              {progress.currentTotal}
              <span className="text-3xl text-gray-500">/{progress.totalProblems}</span>
            </div>
            <div className="relative mb-3 h-4 overflow-hidden rounded-full border border-purple-500/30 bg-gray-900/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
            </div>
            <div className="relative text-xs font-bold uppercase tracking-wider text-purple-400">
              {progressPercentage.toFixed(1)}% Completado
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border-2 border-orange-500/30 bg-gradient-to-br from-gray-900/60 to-orange-950/40 p-6 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-orange-400/50 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-orange-500/20 rounded-full blur-3xl" />
            
            <div className="relative mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-300">
              <Flame className="h-5 w-5 animate-pulse" />
              Racha
            </div>
            <div className="relative text-7xl font-black text-orange-400 drop-shadow-[0_0_30px_rgba(249,115,22,0.6)]">
              {progress.streak}
            </div>
            <div className="relative mt-3 text-xs font-bold uppercase tracking-wider text-orange-400/80">
              Días consecutivos
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-br from-gray-900/60 to-cyan-950/40 p-6 backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-cyan-400/50 hover:shadow-[0_0_50px_rgba(34,211,238,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -top-20 -right-20 h-40 w-40 bg-cyan-500/20 rounded-full blur-3xl" />
            
            <div className="relative mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-cyan-300">
              <Sparkles className="h-5 w-5" />
              Objetivo
            </div>
            <div className="relative text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              15 ENE 2025
            </div>
            <div className="relative mt-3 text-xs font-bold uppercase tracking-wider text-cyan-400">
              {daysRemaining} días • ~{averageNeeded} probs/día
            </div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-2 rounded-xl border-2 px-6 py-3 font-bold uppercase tracking-wider backdrop-blur-sm transition-all ${
                viewMode === 'month'
                  ? 'border-purple-400 bg-purple-600/40 text-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                  : 'border-purple-500/30 bg-gray-900/40 text-purple-400 hover:border-purple-400/50 hover:bg-purple-950/30'
              }`}
            >
              <CalendarRange className="h-5 w-5" />
              Mes
            </button>
            
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-2 rounded-xl border-2 px-6 py-3 font-bold uppercase tracking-wider backdrop-blur-sm transition-all ${
                viewMode === 'week'
                  ? 'border-cyan-400 bg-cyan-600/40 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.4)]'
                  : 'border-cyan-500/30 bg-gray-900/40 text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-950/30'
              }`}
            >
              <CalendarDays className="h-5 w-5" />
              Semana
            </button>
            
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-2 rounded-xl border-2 px-6 py-3 font-bold uppercase tracking-wider backdrop-blur-sm transition-all ${
                viewMode === 'day'
                  ? 'border-pink-400 bg-pink-600/40 text-pink-200 shadow-[0_0_30px_rgba(236,72,153,0.4)]'
                  : 'border-pink-500/30 bg-gray-900/40 text-pink-400 hover:border-pink-400/50 hover:bg-pink-950/30'
              }`}
            >
              <Calendar className="h-5 w-5" />
              Día
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-xl border-2 border-lime-500/30 bg-gray-900/40 px-4 py-3 text-sm font-bold uppercase tracking-wider text-lime-400 backdrop-blur-sm transition-all hover:border-lime-400/50 hover:bg-lime-950/30 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-purple-500/20 bg-gray-900/40 p-8 backdrop-blur-xl">
          {viewMode === 'month' && (
            <MonthView
              year={selectedDate.getFullYear()}
              month={selectedDate.getMonth()}
              progress={progress}
              onDayClick={(date) => {
                setSelectedDate(date);
                setViewMode('day');
              }}
              onMonthChange={(year, month) => setSelectedDate(new Date(year, month, 1))}
            />
          )}
          
          {viewMode === 'week' && (
            <WeekView
              referenceDate={selectedDate}
              progress={progress}
              onUpdateProblem={handleUpdateProblem}
              onDayClick={(date) => {
                setSelectedDate(date);
                setViewMode('day');
              }}
              onWeekChange={(date) => setSelectedDate(date)}
            />
          )}
          
          {viewMode === 'day' && (
            <DayView
              date={selectedDate}
              progress={progress}
              onUpdateProblem={handleUpdateProblem}
              onDateChange={(date) => setSelectedDate(date)}
            />
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500/30" />
          <span>hamletsolanod@gmail.com</span>
          <span className="text-purple-500/50">•</span>
          <span>Feb 2025</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500/30" />
        </div>
      </div>
    </div>
  );
}