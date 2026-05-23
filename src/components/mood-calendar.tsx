'use client';

import { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { MoodEmoji } from '@/components/mood-emoji';
import { DayDetailSheet } from '@/components/day-detail-sheet';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatMonthYear, parseDateKey, toDateKey } from '@/lib/date-utils';
import { getMoodById, type MoodId } from '@/lib/moods';
import { cn } from '@/lib/utils';

type MoodCalendarProps = {
  records: Record<string, MoodId>;
  today: Date;
  onSelectMood: (dateKey: string, moodId: MoodId) => void;
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function MoodCalendar({ records, today, onSelectMood }: MoodCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(today));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = monthStart.getDay();

  const recordedThisMonth = daysInMonth.filter(
    (day) => records[toDateKey(day)],
  ).length;

  const isViewingCurrentMonth = isSameMonth(viewMonth, today);

  const handleDayClick = (day: Date) => {
    if (isAfter(startOfDay(day), startOfDay(today))) {
      return;
    }

    setSelectedDateKey(toDateKey(day));
    setSheetOpen(true);
  };

  const selectedMoodId = selectedDateKey
    ? records[selectedDateKey]
    : undefined;

  const selectedIsFuture = selectedDateKey
    ? isAfter(startOfDay(parseDateKey(selectedDateKey)), startOfDay(today))
    : false;

  return (
    <>
      <Card className="border-0 bg-white/80 shadow-md backdrop-blur-sm dark:bg-white/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">{formatMonthYear(viewMonth)}</CardTitle>
              <CardDescription>
                {recordedThisMonth}일 기록 · {daysInMonth.length}일 중
              </CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="이전 달"
                onClick={() => setViewMonth((month) => subMonths(month, 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {!isViewingCurrentMonth && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setViewMonth(startOfMonth(today))}
                >
                  오늘
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label="다음 달"
                disabled={isViewingCurrentMonth}
                onClick={() => setViewMonth((month) => addMonths(month, 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className={cn(
                  'py-1 font-medium',
                  index === 0 && 'text-rose-500',
                  index === 6 && 'text-blue-500',
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: startPadding }).map((_, index) => (
              <div key={`pad-${index}`} className="aspect-square" />
            ))}

            {daysInMonth.map((day) => {
              const dateKey = toDateKey(day);
              const mood = getMoodById(records[dateKey]);
              const todayFlag = isToday(day);
              const futureDay = isAfter(startOfDay(day), startOfDay(today));
              const isSelected =
                selectedDateKey !== null && isSameDay(day, parseDateKey(selectedDateKey));

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={futureDay}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center rounded-xl text-xs transition-all',
                    mood?.cellBg,
                    todayFlag &&
                      'ring-2 ring-pink-400 ring-offset-1 ring-offset-background dark:ring-pink-500',
                    isSelected && 'scale-105 shadow-md',
                    futureDay
                      ? 'cursor-not-allowed opacity-30'
                      : 'cursor-pointer hover:scale-105 hover:shadow-sm active:scale-95',
                    !mood && !futureDay && 'bg-muted/30 text-muted-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'mb-0.5 font-medium',
                      todayFlag && 'text-pink-700 dark:text-pink-300',
                    )}
                  >
                    {day.getDate()}
                  </span>
                  <span className="text-base leading-none">
                    {mood ? (
                      <MoodEmoji emoji={mood.emoji} size="xs" />
                    ) : (
                      !futureDay && '·'
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            날짜를 눌러 기분을 확인하거나 수정할 수 있어요
          </p>
        </CardContent>
      </Card>

      <DayDetailSheet
        dateKey={selectedDateKey}
        selectedMoodId={selectedMoodId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        readOnly={selectedIsFuture}
        onSelect={(moodId) => {
          if (selectedDateKey) {
            onSelectMood(selectedDateKey, moodId);
          }
        }}
      />
    </>
  );
}
