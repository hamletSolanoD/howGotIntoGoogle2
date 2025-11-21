export interface Problem {
  id: number;
  completed: boolean;
  link?: string;
  completedAt?: string;
}

export interface DayProgress {
  date: string;
  theme: string;
  problems: Problem[];
  url: string;
  notes?: string;
}

export interface ProgressData {
  user: string;
  startDate: string;
  targetDate: string;
  totalProblems: number;
  currentTotal: number;
  streak: number;
  lastCompletedDate?: string;
  days: Record<string, DayProgress>;
}

export type ViewMode = 'month' | 'week' | 'day';

export interface ViewState {
  mode: ViewMode;
  selectedDate: Date;
}