import { getSupabase } from '../supabase';
import type { CalendarEntry } from '../types';

export async function getCalendarData(): Promise<CalendarEntry[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('calendar')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch calendar data: ${error.message}`);
  }

  return data || [];
}
