export interface CalendarEntry {
  id: string; // DATE as string (YYYY-MM-DD format)
  studentid: string;
  courseid: string;
  timeactive: number; // BIGINT
  pageloads: number; // BIGINT
}

// Supabase `tutors-connect-courses` table model
export interface TutorsConnectCourse {
  course_id: string; // text (primary key)
  visited_at: string | null; // timestamptz
  visit_count: number | null; // int8 / bigint
  course_record: {
    title?: string;
    [key: string]: any; // Allow other fields in JSON
  } | null; // json
}
