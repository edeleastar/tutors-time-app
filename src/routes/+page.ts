import { getCalendarData } from '$lib/services/calendar';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  try {
    const calendarData = await getCalendarData();
    return {
      calendarData,
      error: null
    };
  } catch (error) {
    return {
      calendarData: [],
      error: error instanceof Error ? error.message : 'Failed to load calendar data'
    };
  }
};
