'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

import { MoodEmoji } from '@/components/mood-emoji';
import { AppNav, type AppTab } from '@/components/app-nav';
import { MoodCalendar } from '@/components/mood-calendar';
import { MoodPicker } from '@/components/mood-picker';
import { MoodStatsPanel } from '@/components/mood-stats-panel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDisplayDate, toDateKey } from '@/lib/date-utils';
import { calculateMoodStats } from '@/lib/mood-stats';
import { getMoodById, type MoodId } from '@/lib/moods';
import { useMoodStore } from '@/lib/mood-store';
import { useToast } from '@/hooks/use-toast';

const TAB_HEADERS: Record<AppTab, { title: string; subtitle: string }> = {
  today: {
    title: '오늘 기분은 어때요?',
    subtitle: '하루에 하나, 기분을 선택해 주세요',
  },
  calendar: {
    title: '기분 달력',
    subtitle: '날짜별 기록을 확인하고 수정해요',
  },
  stats: {
    title: '기분 통계',
    subtitle: '나의 기분 패턴을 살펴봐요',
  },
};

export default function Home() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [today] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState<AppTab>('today');

  const records = useMoodStore((state) => state.records);
  const setMood = useMoodStore((state) => state.setMood);

  const todayKey = toDateKey(today);
  const todayMoodId = mounted ? records[todayKey] : undefined;
  const todayMood = getMoodById(todayMoodId);
  const stats = mounted ? calculateMoodStats(records, today) : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (dateKey: string, moodId: MoodId) => {
    setMood(dateKey, moodId);
    const mood = getMoodById(moodId);

    toast({
      title: '기분이 저장됐어요',
      description: `"${mood?.label}" 기분으로 기록했어요.`,
    });
  };

  const header = TAB_HEADERS[activeTab];

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-background to-rose-50/40 dark:from-pink-950/30 dark:via-background dark:to-rose-950/10">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <header className="mb-6 text-center">
          <p className="mb-2 text-sm font-medium text-pink-600 dark:text-pink-400">
            Mood Tracker
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {header.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab === 'today' ? formatDisplayDate(today) : header.subtitle}
          </p>

          {mounted && stats && stats.currentStreak > 0 && activeTab === 'today' && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-700 dark:bg-pink-950/60 dark:text-pink-300">
              <Flame className="h-3.5 w-3.5" />
              {stats.currentStreak}일 연속 기록 중
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'today' && (
              <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm dark:bg-white/5">
                <CardHeader className="pb-4 text-center">
                  <CardTitle className="text-xl">오늘의 기분</CardTitle>
                  <CardDescription>
                    5가지 이모지 중 하나를 골라주세요
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <MoodPicker
                    selected={todayMoodId}
                    onSelect={(moodId) => handleSelect(todayKey, moodId)}
                  />

                  {mounted && todayMood ? (
                    <div className="rounded-2xl bg-muted/50 px-4 py-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        오늘 선택한 기분
                      </p>
                      <MoodEmoji emoji={todayMood.emoji} size="xl" />
                      <p className="mt-1 font-medium">{todayMood.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {todayMood.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">
                      아직 오늘의 기분을 선택하지 않았어요
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'calendar' && mounted && (
              <MoodCalendar
                records={records}
                today={today}
                onSelectMood={handleSelect}
              />
            )}

            {activeTab === 'stats' && mounted && (
              <MoodStatsPanel records={records} today={today} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AppNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  );
}
