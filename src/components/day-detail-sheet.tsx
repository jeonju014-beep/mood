'use client';

import { MoodEmoji } from '@/components/mood-emoji';
import { MoodPicker } from '@/components/mood-picker';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { formatFullDate } from '@/lib/date-utils';
import { getMoodById, type MoodId } from '@/lib/moods';

type DayDetailSheetProps = {
  dateKey: string | null;
  selectedMoodId?: MoodId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (moodId: MoodId) => void;
  readOnly?: boolean;
};

export function DayDetailSheet({
  dateKey,
  selectedMoodId,
  open,
  onOpenChange,
  onSelect,
  readOnly = false,
}: DayDetailSheetProps) {
  const mood = getMoodById(selectedMoodId);

  if (!dateKey) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8">
        <SheetHeader className="text-left">
          <SheetTitle>{formatFullDate(dateKey)}</SheetTitle>
          <SheetDescription>
            {readOnly
              ? '미래 날짜는 기록할 수 없어요'
              : mood
                ? '기분을 변경하려면 다시 선택해 주세요'
                : '이 날의 기분을 선택해 주세요'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {mood && (
            <div className="rounded-2xl bg-muted/50 px-4 py-4 text-center">
              <MoodEmoji emoji={mood.emoji} size="xl" />
              <p className="mt-2 font-medium">{mood.label}</p>
              <p className="text-sm text-muted-foreground">
                {mood.description}
              </p>
            </div>
          )}

          {!readOnly && (
            <MoodPicker
              selected={selectedMoodId}
              onSelect={(moodId) => {
                onSelect(moodId);
                onOpenChange(false);
              }}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
