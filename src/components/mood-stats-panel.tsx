'use client';

import type { ReactNode } from 'react';
import { isToday, subDays } from 'date-fns';
import { Flame, Target, TrendingUp, Trophy } from 'lucide-react';

import { MoodEmoji } from '@/components/mood-emoji';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatShortDate, toDateKey } from '@/lib/date-utils';
import {
  averageToLabel,
  calculateMoodStats,
  type MoodStats,
} from '@/lib/mood-stats';
import { getMoodById, type MoodId } from '@/lib/moods';
import { cn } from '@/lib/utils';

type MoodStatsPanelProps = {
  records: Record<string, MoodId>;
  today: Date;
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  sub?: ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-muted/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            accent ?? 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400',
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function DistributionBar({ stats }: { stats: MoodStats }) {
  if (stats.totalCount === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        아직 기록이 없어요
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex h-3 overflow-hidden rounded-full">
        {stats.distribution
          .filter(({ count }) => count > 0)
          .map(({ mood, count }) => (
            <div
              key={mood.id}
              className={cn('h-full transition-all', mood.cellBg.replace('/80', ''))}
              style={{ width: `${(count / stats.totalCount) * 100}%` }}
              title={`${mood.label}: ${count}회`}
            />
          ))}
      </div>

      <ul className="space-y-2">
        {stats.distribution.map(({ mood, count, percentage }) => (
          <li key={mood.id} className="flex items-center gap-3">
            <MoodEmoji emoji={mood.emoji} size="sm" />
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{mood.label}</span>
                <span className="text-muted-foreground">
                  {count}회 ({percentage}%)
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn('h-full rounded-full', mood.cellBg.replace('/80', ''))}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WeeklyTrend({ stats }: { stats: MoodStats }) {
  return (
    <div className="flex items-end justify-between gap-1">
      {stats.last7Days.map(({ dateKey, mood, score }) => {
        const date = new Date(`${dateKey}T12:00:00`);
        const todayFlag = isToday(date);
        const height = score ? `${(score / 5) * 100}%` : '8%';

        return (
          <div
            key={dateKey}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex h-20 w-full items-end justify-center">
              <div
                className={cn(
                  'w-full max-w-[2rem] rounded-t-lg transition-all',
                  mood ? mood.cellBg.replace('/80', '') : 'bg-muted',
                  todayFlag && 'ring-2 ring-pink-400 ring-offset-1 ring-offset-background',
                )}
                style={{ height }}
                title={mood ? `${mood.label} (${score}/5)` : '기록 없음'}
              />
            </div>
            <MoodEmoji emoji={mood?.emoji ?? '·'} size="sm" />
            <span
              className={cn(
                'text-[10px] text-muted-foreground',
                todayFlag && 'font-medium text-pink-600 dark:text-pink-400',
              )}
            >
              {date.getDate()}일
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function MoodStatsPanel({ records, today }: MoodStatsPanelProps) {
  const stats = calculateMoodStats(records, today);

  const recentEntries = Array.from({ length: 14 }, (_, index) => {
    const date = subDays(today, index);
    const dateKey = toDateKey(date);
    const moodId = records[dateKey];

    if (!moodId) {
      return null;
    }

    return {
      dateKey,
      date,
      mood: getMoodById(moodId)!,
    };
  }).filter(Boolean);

  const monthCompletion =
    stats.thisMonthTotalDays > 0
      ? Math.round((stats.thisMonthCount / stats.thisMonthTotalDays) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Flame}
          label="연속 기록"
          value={`${stats.currentStreak}일`}
          sub={`최장 ${stats.longestStreak}일`}
          accent="bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400"
        />
        <StatCard
          icon={Trophy}
          label="총 기록"
          value={`${stats.totalCount}일`}
          sub={
            stats.mostCommonMood
              ? (
                <>
                  가장 많음: <MoodEmoji emoji={stats.mostCommonMood.emoji} size="xs" className="mx-0.5 align-middle" /> {stats.mostCommonMood.label}
                </>
              )
              : undefined
          }
          accent="bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
        />
        <StatCard
          icon={TrendingUp}
          label="이번 달 평균"
          value={
            stats.thisMonthAverage !== null
              ? stats.thisMonthAverage.toFixed(1)
              : '-'
          }
          sub={
            stats.thisMonthAverage !== null
              ? averageToLabel(stats.thisMonthAverage)
              : '기록 없음'
          }
          accent="bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-400"
        />
        <StatCard
          icon={Target}
          label="이번 달 달성률"
          value={`${monthCompletion}%`}
          sub={`${stats.thisMonthCount}/${stats.thisMonthTotalDays}일 기록`}
          accent="bg-pink-200/80 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
        />
      </div>

      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur-sm dark:bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">최근 7일 추이</CardTitle>
          <CardDescription>일별 기분 점수를 한눈에 확인해요</CardDescription>
        </CardHeader>
        <CardContent>
          <WeeklyTrend stats={stats} />
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur-sm dark:bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">기분 분포</CardTitle>
          <CardDescription>
            {stats.totalCount > 0
              ? `전체 ${stats.totalCount}일 기록 기준`
              : '기록을 쌓으면 분포가 표시돼요'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DistributionBar stats={stats} />
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/80 shadow-sm backdrop-blur-sm dark:bg-white/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">최근 기록</CardTitle>
          <CardDescription>지난 2주간 선택한 기분이에요</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              아직 기록이 없어요. 오늘의 기분을 선택해 보세요.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentEntries.map((entry) => (
                <li
                  key={entry!.dateKey}
                  className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <MoodEmoji emoji={entry!.mood.emoji} size="md" />
                    <div>
                      <p className="text-sm font-medium">{entry!.mood.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatShortDate(entry!.dateKey)}
                      </p>
                    </div>
                  </div>
                  {isToday(entry!.date) && (
                    <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                      오늘
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
