'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MoodId } from '@/lib/moods';

type MoodRecords = Record<string, MoodId>;

type MoodStore = {
  records: MoodRecords;
  setMood: (dateKey: string, moodId: MoodId) => void;
  getMood: (dateKey: string) => MoodId | undefined;
};

export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      records: {},
      setMood: (dateKey, moodId) =>
        set((state) => ({
          records: { ...state.records, [dateKey]: moodId },
        })),
      getMood: (dateKey) => get().records[dateKey],
    }),
    {
      name: 'moodtracker-records',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
