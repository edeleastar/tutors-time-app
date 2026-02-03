export interface CalendarEntry {
  id: string; // DATE as string (YYYY-MM-DD format)
  studentid: string;
  courseid: string;
  timeactive: number; // BIGINT
  pageloads: number; // BIGINT
}
