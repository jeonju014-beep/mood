import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'M월 d일 EEEE', { locale: ko });
}

export function formatMonthYear(date: Date): string {
  return format(date, 'yyyy년 M월', { locale: ko });
}

export function formatShortDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return format(date, 'M/d (EEE)', { locale: ko });
}

export function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00`);
}

export function formatFullDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return format(date, 'yyyy년 M월 d일 EEEE', { locale: ko });
}
