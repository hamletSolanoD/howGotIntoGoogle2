import type { ProgressData, DayProgress, Problem } from './types';
import { formatDate, getThemeForDate } from './cycles';

const STORAGE_KEY = 'neetcode_progress';

const DEFAULT_PROGRESS: ProgressData = {
  user: "hamletsolanod@gmail.com",
  startDate: "2025-11-20",
  targetDate: "2025-01-15",
  totalProblems: 300,
  currentTotal: 23,
  streak: 7,
  days: {}
};

export function loadProgress(): ProgressData {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (error) {
    console.error('Error loading progress:', error);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: ProgressData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress, null, 2));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function getDayProgress(progress: ProgressData, date: Date): DayProgress {
  const dateStr = formatDate(date);
  
  if (!progress.days[dateStr]) {
    return {
      date: dateStr,
      theme: getThemeForDate(dateStr),
      url: "",
      problems: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        completed: false
      }))
    };
  }
  
  return progress.days[dateStr];
}

export function updateProblem(
  progress: ProgressData,
  date: Date,
  problemId: number,
  updates: Partial<Problem>
): ProgressData {
  const dateStr = formatDate(date);
  const dayProgress = getDayProgress(progress, date);
  
  const updatedProblems = dayProgress.problems.map(p =>
    p.id === problemId ? { ...p, ...updates } : p
  );
  
  const oldCompleted = dayProgress.problems.filter(p => p.completed).length;
  const newCompleted = updatedProblems.filter(p => p.completed).length;
  const diff = newCompleted - oldCompleted;
  
  const updatedDayProgress: DayProgress = {
    ...dayProgress,
    problems: updatedProblems
  };
  
  const newProgress = {
    ...progress,
    currentTotal: progress.currentTotal + diff,
    days: {
      ...progress.days,
      [dateStr]: updatedDayProgress
    }
  };
  
  if (updates.completed) {
    newProgress.lastCompletedDate = dateStr;
    newProgress.streak = calculateStreak(newProgress);
  }
  
  return newProgress;
}

export function calculateStreak(progress: ProgressData): number {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateStr = formatDate(currentDate);
    const dayData = progress.days[dateStr];
    
    if (!dayData) break;
    
    const completed = dayData.problems.filter(p => p.completed).length;
    if (completed === 0) break;
    
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
    
    if (streak > 365) break;
  }
  
  return streak;
}

export function exportToJSON(progress: ProgressData): string {
  return JSON.stringify(progress, null, 2);
}

export function importFromJSON(jsonString: string): ProgressData | null {
  try {
    const parsed = JSON.parse(jsonString);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (error) {
    console.error('Error importing JSON:', error);
    return null;
  }
}