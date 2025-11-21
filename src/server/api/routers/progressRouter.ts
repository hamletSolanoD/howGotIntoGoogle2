import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const progressRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const progress = await ctx.db.progress.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        days: {
          include: {
            problems: true,
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!progress) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Progress not found',
      });
    }

    return progress;
  }),

  create: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        targetDate: z.date(),
        totalProblems: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.progress.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Progress already exists',
        });
      }

      return ctx.db.progress.create({
        data: {
          userId: ctx.session.user.id,
          startDate: input.startDate,
          targetDate: input.targetDate,
          totalProblems: input.totalProblems,
        },
      });
    }),

  getDayProgress: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.progress.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!progress) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Progress not found',
        });
      }

      const dayProgress = await ctx.db.dayProgress.findUnique({
        where: {
          progressId_date: {
            progressId: progress.id,
            date: input.date,
          },
        },
        include: {
          problems: {
            orderBy: { problemNumber: 'asc' },
          },
        },
      });

      return dayProgress;
    }),

  updateProblem: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        problemNumber: z.number().int().min(1).max(6),
        completed: z.boolean(),
        link: z.string().url().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const progress = await ctx.db.progress.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!progress) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Progress not found',
        });
      }

      let dayProgress = await ctx.db.dayProgress.findUnique({
        where: {
          progressId_date: {
            progressId: progress.id,
            date: input.date,
          },
        },
        include: {
          problems: true,
        },
      });

      if (!dayProgress) {
        const theme = getThemeForDate(input.date);
        dayProgress = await ctx.db.dayProgress.create({
          data: {
            progressId: progress.id,
            date: input.date,
            theme,
            problems: {
              create: Array.from({ length: 6 }, (_, i) => ({
                problemNumber: i + 1,
                completed: false,
              })),
            },
          },
          include: {
            problems: true,
          },
        });
      }

      const existingProblem = dayProgress.problems.find(
        (p) => p.problemNumber === input.problemNumber
      );

      let problem;
      if (existingProblem) {
        problem = await ctx.db.problem.update({
          where: { id: existingProblem.id },
          data: {
            completed: input.completed,
            link: input.link,
            completedAt: input.completed ? new Date() : null,
          },
        });
      } else {
        problem = await ctx.db.problem.create({
          data: {
            dayProgressId: dayProgress.id,
            problemNumber: input.problemNumber,
            completed: input.completed,
            link: input.link,
            completedAt: input.completed ? new Date() : null,
          },
        });
      }

      const allProblems = await ctx.db.problem.findMany({
        where: { dayProgressId: dayProgress.id },
      });

      const completedCount = allProblems.filter((p) => p.completed).length;
      const oldCompletedCount = dayProgress.problems.filter((p) => p.completed).length;
      const diff = completedCount - oldCompletedCount;

      await ctx.db.progress.update({
        where: { id: progress.id },
        data: {
          currentTotal: {
            increment: diff,
          },
          lastCompletedDate: input.completed ? input.date : undefined,
        },
      });

      return problem;
    }),

  getWeekProgress: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.progress.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!progress) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Progress not found',
        });
      }

      const days = await ctx.db.dayProgress.findMany({
        where: {
          progressId: progress.id,
          date: {
            gte: input.startDate,
            lte: input.endDate,
          },
        },
        include: {
          problems: {
            orderBy: { problemNumber: 'asc' },
          },
        },
        orderBy: { date: 'asc' },
      });

      return days;
    }),

  getMonthProgress: protectedProcedure
    .input(
      z.object({
        year: z.number().int(),
        month: z.number().int().min(0).max(11),
      })
    )
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.progress.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!progress) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Progress not found',
        });
      }

      const startDate = new Date(input.year, input.month, 1);
      const endDate = new Date(input.year, input.month + 1, 0);

      const days = await ctx.db.dayProgress.findMany({
        where: {
          progressId: progress.id,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          problems: {
            orderBy: { problemNumber: 'asc' },
          },
        },
        orderBy: { date: 'asc' },
      });

      return days;
    }),
});

function getThemeForDate(date: Date): string {
  const THEMES = [
    'Arrays, Two Pointers, Sliding Window',
    'HashMaps, Sets, Linked Lists',
    'Binary Search, Intervals',
    'Trees DFS/BFS',
    'Graphs + Heaps',
    'Backtracking + Greedy',
    'DP (1D)',
    'Arrays Avanzado',
    'HashMaps + Tries',
    'Binary Search Avanzado',
    'Binary Trees + BST',
    'Graphs + Dijkstra',
    'Backtracking Avanzado',
    'DP (2D)',
  ];

  const start = new Date('2024-11-20');
  const diffDays = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return THEMES[diffDays % 14];
}