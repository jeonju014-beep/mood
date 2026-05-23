'use client';

import { MoodEmoji } from '@/components/mood-emoji';
import { cn } from '@/lib/utils';
import { MOODS, type MoodId } from '@/lib/moods';

type MoodPickerProps = {
  selected?: MoodId;
  onSelect: (moodId: MoodId) => void;
};

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {MOODS.map((mood) => {
        const isSelected = selected === mood.id;

        return (
          <button
            key={mood.id}
            type="button"
            aria-label={mood.label}
            aria-pressed={isSelected}
            onClick={() => onSelect(mood.id)}
            className={cn(
              'group flex flex-col items-center gap-2 rounded-2xl border border-transparent p-3 transition-all duration-200 sm:p-4',
              mood.bg,
              isSelected
                ? cn('scale-105 border-current shadow-md ring-2 ring-offset-2 ring-offset-background', mood.ring)
                : 'hover:scale-105 hover:shadow-sm',
            )}
          >
            <MoodEmoji
              emoji={mood.emoji}
              size="lg"
              className={cn(
                'transition-transform duration-200',
                isSelected ? 'scale-110' : 'group-hover:scale-110',
              )}
            />
            <span
              className={cn(
                'text-[10px] font-medium leading-tight sm:text-xs',
                isSelected ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {mood.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
