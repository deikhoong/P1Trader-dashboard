import { CourseRequest, NewsRequest, Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetCourses = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/courses', { params: pagination });
  return response.data;
}

export const GetCourse = async (id: string) => {
  const response = await axiosInstance.get(`/admin/courses/${id}`);
  return response.data;
}

export const UpdateCourse = async (id: string, data: CourseRequest) => {
  const response = await axiosInstance.patch(`/admin/courses/${id}`, data);
  return response.data;
}

