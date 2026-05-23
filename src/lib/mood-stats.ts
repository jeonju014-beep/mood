import {
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subDays,
} from 'date-fns';

import { parseDateKey, toDateKey } from '@/lib/date-utils';
import { getMoodById, MOODS, type Mood, type MoodId } from '@/lib/moods';

export type MoodDistribution = {
  mood: Mood;
  count: number;
  percentage: number;
};

export type MoodStats = {
  totalCount: number;
  currentStreak: number;
  longestStreak: number;
  thisMonthCount: number;
  thisMonthTotalDays: number;
  thisMonthAverage: number | null;
  overallAverage: number | null;
  mostCommonMood: Mood | null;
  distribution: MoodDistribution[];
  last7Days: { dateKey: string; mood: Mood | null; score: number | null }[];
};

function computeStreak(
  records: Record<string, MoodId>,
  today: Date,
  direction: 'current' | 'longest',
): number {
  const todayStart = startOfDay(today);
  const sortedKeys = Object.keys(records).sort();

  if (sortedKeys.length === 0) {
    return 0;
  }

  if (direction === 'current') {
    let streak = 0;
    let cursor = todayStart;

    while (records[toDateKey(cursor)]) {
      streak += 1;
      cursor = subDays(cursor, 1);
    }

    return streak;
  }

  let longest = 0;
  let current = 0;
  let prevDate: Date | null = null;

  for (const dateKey of sortedKeys) {
    const date = startOfDay(parseDateKey(dateKey));

    if (prevDate && date.getTime() === subDays(prevDate, 1).getTime()) {
      current += 1;
    } else {
      current = 1;
    }

    longest = Math.max(longest, current);
    prevDate = date;
  }

  return longest;
}

export function calculateMoodStats(
  records: Record<string, MoodId>,
  today: Date,
): MoodStats {
  const entries = Object.entries(records).map(([dateKey, moodId]) => ({
    dateKey,
    mood: getMoodById(moodId)!,
  }));

  const totalCount = entries.length;
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const thisMonthEntries = entries.filter(({ dateKey }) =>
    isSameMonth(parseDateKey(dateKey), today),
  );

  const thisMonthCount = thisMonthEntries.length;
  const thisMonthTotalDays = daysInMonth.filter(
    (day) => !isAfter(startOfDay(day), startOfDay(today)),
  ).length;

  const thisMonthAverage =
    thisMonthCount > 0
      ? thisMonthEntries.reduce((sum, { mood }) => sum + mood.score, 0) /
        thisMonthCount
      : null;

  const overallAverage =
    totalCount > 0
      ? entries.reduce((sum, { mood }) => sum + mood.score, 0) / totalCount
      : null;

  const countByMood = MOODS.map((mood) => ({
    mood,
    count: entries.filter(({ mood: entryMood }) => entryMood.id === mood.id)
      .length,
  }));

  const mostCommon = countByMood.reduce(
    (best, item) => (item.count > best.count ? item : best),
    countByMood[0],
  );

  const distribution: MoodDistribution[] = countByMood.map(
    ({ mood, count }) => ({
      mood,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    }),
  );

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(today, 6 - index);
    const dateKey = toDateKey(date);
    const moodId = records[dateKey];
    const mood = getMoodById(moodId) ?? null;

    return {
      dateKey,
      mood,
      score: mood?.score ?? null,
    };
  });

  return {
    totalCount,
    currentStreak: computeStreak(records, today, 'current'),
    longestStreak: computeStreak(records, today, 'longest'),
    thisMonthCount,
    thisMonthTotalDays,
    thisMonthAverage,
    overallAverage,
    mostCommonMood: mostCommon.count > 0 ? mostCommon.mood : null,
    distribution,
    last7Days,
  };
}

export function averageToLabel(average: number | null): string {
  if (average === null) {
    return '-';
  }

  if (average >= 4.5) return '최고예요';
  if (average >= 3.5) return '좋아요';
  if (average >= 2.5) return '보통이에요';
  if (average >= 1.5) return '우울해요';
  return '힘들어요';
}
