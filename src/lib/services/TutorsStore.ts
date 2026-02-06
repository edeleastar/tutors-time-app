import type { CourseCalendar, LearningRecord } from "../types";
import { loadCalendarDataForCourses } from "./calendar";
import { getSupabase } from "./supabase";
import type { TutorsConnectCourse } from "$lib/types";

export const TutorsStore = {
  /**
   * Load calendar data for one or more courses and a date range.
   * Delegates to the existing calendar service and returns the CourseCalendar[]
   * shape expected by the grids.
   */
  async loadCalendar(
    courseIds: string[],
    startDate: string | null,
    endDate: string | null
  ): Promise<CourseCalendar[]> {
    return loadCalendarDataForCourses(courseIds, startDate, endDate);
  },

  /**
   * Return a display title for a given course ID.
   * Uses tutors-connect-courses.course_record.title when available, otherwise falls back to the ID.
   */
  async getCourseTitle(courseId: string): Promise<string> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("tutors-connect-courses")
      .select("course_id, course_record")
      .eq("course_id", courseId)
      .maybeSingle();

    if (error || !data) {
      return courseId;
    }

    const row = data as TutorsConnectCourse;
    const id = row.course_id?.trim() || courseId;
    const title = row.course_record?.title?.trim();
    return title && title.length > 0 ? title : id;
  },

  /**
   * Retrieve learning records from the learning_records table.
   * Filters by student_id, course_id, and type (all required).
   * Returns an empty array if no records are found or on error.
   */
  async getLearningRecords(
    studentId: string,
    courseId: string,
    type: string
  ): Promise<LearningRecord[]> {
    const supabase = getSupabase();
    let query = supabase
      .from("learning_records")
      .select("*")
      .eq("student_id", studentId)
      .eq("course_id", courseId)
      .eq("type", type);

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch learning records:", error.message);
      return [];
    }

    return (data as LearningRecord[]) ?? [];
  },

  /**
   * Retrieve all learning records for a given course (all students, all types).
   * Returns an empty array if no records are found or on error.
   */
  async getAllLearningRecordsForCourse(courseId: string): Promise<LearningRecord[]> {
    const supabase = getSupabase();
    let query = supabase
      .from("learning_records")
      .select("*")
      .eq("course_id", courseId)
      .eq("type", "lab")
      .order("date_last_accessed", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Failed to fetch learning records:", error.message);
      return [];
    }

    return (data as LearningRecord[]) ?? [];
  }
};

