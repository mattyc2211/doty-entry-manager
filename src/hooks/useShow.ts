import { useQuery } from '@tanstack/react-query';
import { fetchActiveShow, entryWindow, type Show, type EntryWindow } from '@/lib/show';

/**
 * The active show, fetched once and shared.
 *
 * Everything about the show now comes from here: dates, fees, the bank account,
 * the qualification wording. In the 2025 build these were constants compiled
 * into five different files, so a change meant a deploy and, more than once,
 * meant three of the five agreeing and two of them not.
 */
export function useShow(): {
  show: Show | undefined;
  window: EntryWindow | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  const { data, isLoading, error } = useQuery({
    queryKey: ['active-show'],
    queryFn: fetchActiveShow,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    show: data,
    window: data ? entryWindow(data) : undefined,
    isLoading,
    error: (error as Error) ?? null,
  };
}
