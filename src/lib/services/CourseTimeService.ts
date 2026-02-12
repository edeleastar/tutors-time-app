import { CourseTime } from "./CourseTime";
import type { StudentCalendar } from "../types";

const courseMap = new Map<string, CourseTime>();

export const CourseTimeService = {
  /**
   * Load a course by ID. Returns cached CourseTime if already loaded (when no date filter),
   * otherwise creates and loads a new one.
   * Caching only applies when both startDate and endDate are null/undefined.
   */
  async loadCourse(
    id: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<CourseTime> {
    const trimmedId = id.trim();
    if (!trimmedId) throw new Error("Course ID is required");

    const useCache = (startDate == null || startDate === "") && (endDate == null || endDate === "");
    const normalizedStart = startDate && startDate.trim() ? startDate.trim() : null;
    const normalizedEnd = endDate && endDate.trim() ? endDate.trim() : null;

    if (useCache) {
      const cached = courseMap.get(trimmedId);
      if (cached) {
        return cached;
      }
    }

    const courseTime = new CourseTime();
    await courseTime.loadCalendar(trimmedId, normalizedStart, normalizedEnd);

    if (useCache) {
      courseMap.set(trimmedId, courseTime);
    }

    return courseTime;
  },

  /**
   * Load calendar data for a single student within a course and date range.
   * Returns a StudentCalendar instance with calendar and lab data for the student.
   */
  async loadStudentCalendar(
    courseId: string,
    studentId: string,
    startDate?: string | null,
    endDate?: string | null
  ): Promise<StudentCalendar> {
    const trimmedCourseId = courseId.trim();
    const trimmedStudentId = studentId.trim();

    if (!trimmedCourseId) throw new Error("Course ID is required");
    if (!trimmedStudentId) throw new Error("Student ID is required");

    const normalizedStart = startDate && startDate.trim() ? startDate.trim() : null;
    const normalizedEnd = endDate && endDate.trim() ? endDate.trim() : null;

    const courseTime = new CourseTime();
    return await courseTime.loadStudentCalendar(trimmedCourseId, trimmedStudentId, normalizedStart, normalizedEnd);
  }
};
