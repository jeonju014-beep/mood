import { cn } from '@/lib/utils';

type MoodEmojiProps = {
  emoji: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const SIZES = {
  xs: 'text-sm',
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl sm:text-4xl',
  xl: 'text-4xl',
};

export function MoodEmoji({ emoji, size = 'md', className }: MoodEmojiProps) {
  return (
    <span
      aria-hidden
      className={cn('mood-emoji inline-block select-none leading-none', SIZES[size], className)}
    >
      {emoji}
    </span>
  );
}
