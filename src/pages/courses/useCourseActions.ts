import { useCallback, useState } from "react";
import { message } from "antd";
import { CourseInfo, CourseRequest } from "../../api/api.types";

import { GetCourse, UpdateCourse } from "../../api/courses";


export function useCourseActions(courseId?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<CourseInfo | null>(null);

  // Fetch course details
  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const response = await GetCourse(courseId);
      setCourse(response.data);
    } catch (error) {
      message.error("Failed to fetch course details.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Update course
  const updateCourse = useCallback(async (id: string, updatedData: CourseRequest) => {
    if (!courseId) return;
    setLoading(true);
    try {
      await UpdateCourse(id, updatedData);
      message.success("Event updated successfully.");
      return true;
    } catch (error) {
      message.error("Failed to update event.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [courseId]);



  return { course, loading, fetchCourse, updateCourse };
}