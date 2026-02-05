import { getSupabase } from "./supabase";
import type { CalendarEntry } from "../types";

export async function getCalendarData(courseid?: string): Promise<CalendarEntry[]> {
  const supabase = getSupabase();
  let query = supabase.from("calendar").select("*").order("id", { ascending: true });

  if (courseid) {
    query = query.eq("courseid", courseid);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch calendar data: ${error.message}`);
  }

  return data || [];
}

/** Filter calendar entries by date range. */
export function filterByDateRange(entries: CalendarEntry[], startDate: string | null, endDate: string | null): CalendarEntry[] {
  if (!startDate && !endDate) {
    return entries;
  }

  return entries.filter((entry) => {
    const entryDate = entry.id;
    if (startDate && entryDate < startDate) {
      return false;
    }
    if (endDate && entryDate > endDate) {
      return false;
    }
    return true;
  });
}

export type CourseViewState = {
  id: string;
  data: CalendarEntry[];
  loading: boolean;
  error: string | null;
};

/** Load calendar data for multiple courses with date filtering. */
export async function loadCalendarDataForCourses(courseIds: string[], startDate: string | null, endDate: string | null): Promise<CourseViewState[]> {
  const uniqueIds = Array.from(new Set(courseIds.map((id) => id.trim()).filter(Boolean)));

  if (uniqueIds.length === 0) {
    throw new Error("At least one course ID is required");
  }

  // Initialize per-course state
  const courses: CourseViewState[] = uniqueIds.map((id) => ({
    id,
    data: [],
    loading: true,
    error: null
  }));

  // Load data for each course
  const results = await Promise.allSettled(
    uniqueIds.map(async (id) => {
      try {
        const rawData = await getCalendarData(id);
        const filteredData = filterByDateRange(rawData, startDate, endDate);
        return { id, data: filteredData, error: null };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load calendar data";
        return { id, data: [], error: msg };
      }
    })
  );

  // Update courses array with results
  return courses.map((course, index) => {
    const result = results[index];
    if (result.status === "fulfilled") {
      return {
        ...course,
        data: result.value.data,
        loading: false,
        error: result.value.error
      };
    } else {
      return {
        ...course,
        loading: false,
        error: result.reason?.message || "Failed to load calendar data"
      };
    }
  });
}
