import { useQuery } from '@tanstack/react-query';
import { habitsService } from '@/services/supabase/habitsService';

export interface MicroAction {
  title: string;
  description: string;
  duration?: string;
  icon?: string;
  onPress?: () => void;
}

export function useHabitsToday() {
  return useQuery({
    queryKey: ['habits-today'],
    queryFn: async () => {
      const { data, error } = await habitsService.getToday();
      if (error) throw error;
      return data;
    },
  });
}

