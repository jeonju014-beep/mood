'use client';

import { BarChart3, CalendarDays, Smile } from 'lucide-react';

import { cn } from '@/lib/utils';

export type AppTab = 'today' | 'calendar' | 'stats';

type AppNavProps = {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

const TABS: { id: AppTab; label: string; icon: typeof Smile }[] = [
  { id: 'today', label: '오늘', icon: Smile },
  { id: 'calendar', label: '달력', icon: CalendarDays },
  { id: 'stats', label: '통계', icon: BarChart3 },
];

export function AppNav({ activeTab, onTabChange }: AppNavProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-stretch px-2 pb-[env(safe-area-inset-bottom)]">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-pink-600 dark:text-pink-400'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform',
                  isActive && 'scale-110',
                )}
              />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
