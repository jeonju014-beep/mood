export const MOOD_IDS = ['great', 'good', 'neutral', 'down', 'hard'] as const;

export type MoodId = (typeof MOOD_IDS)[number];

export type Mood = {
  id: MoodId;
  emoji: string;
  label: string;
  description: string;
  score: number;
  ring: string;
  bg: string;
  cellBg: string;
};

export const MOODS: Mood[] = [
  {
    id: 'great',
    emoji: '😄',
    label: '최고예요',
    description: '기분이 아주 좋아요',
    score: 5,
    ring: 'ring-pink-400',
    bg: 'bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-950/60',
    cellBg: 'bg-pink-100/80 dark:bg-pink-950/50',
  },
  {
    id: 'good',
    emoji: '😊',
    label: '좋아요',
    description: '나쁘지 않은 하루예요',
    score: 4,
    ring: 'ring-rose-400',
    bg: 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60',
    cellBg: 'bg-rose-100/80 dark:bg-rose-950/50',
  },
  {
    id: 'neutral',
    emoji: '😐',
    label: '보통이에요',
    description: '그저 그런 하루예요',
    score: 3,
    ring: 'ring-fuchsia-300',
    bg: 'bg-fuchsia-50 hover:bg-fuchsia-100 dark:bg-fuchsia-950/40 dark:hover:bg-fuchsia-950/60',
    cellBg: 'bg-fuchsia-100/80 dark:bg-fuchsia-950/50',
  },
  {
    id: 'down',
    emoji: '😔',
    label: '우울해요',
    description: '조금 가라앉은 기분이에요',
    score: 2,
    ring: 'ring-pink-500',
    bg: 'bg-pink-100/70 hover:bg-pink-200/80 dark:bg-pink-950/50 dark:hover:bg-pink-950/70',
    cellBg: 'bg-pink-200/70 dark:bg-pink-900/50',
  },
  {
    id: 'hard',
    emoji: '😢',
    label: '힘들어요',
    description: '오늘은 많이 힘든 날이에요',
    score: 1,
    ring: 'ring-rose-500',
    bg: 'bg-rose-100/70 hover:bg-rose-200/80 dark:bg-rose-950/50 dark:hover:bg-rose-950/70',
    cellBg: 'bg-rose-200/70 dark:bg-rose-900/50',
  },
];

export function getMoodById(id: MoodId | undefined): Mood | undefined {
  return MOODS.find((mood) => mood.id === id);
}
