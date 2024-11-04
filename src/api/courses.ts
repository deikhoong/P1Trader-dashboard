import { NewsRequest, Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetCourses = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/courses', { params: pagination });
  return response.data;
}

export const GetCourse = async (id: string) => {
  const response = await axiosInstance.get(`/admin/course/${id}`);
  return response.data;
}

export const UpdateCourse = async (id: string, data: NewsRequest) => {
  const response = await axiosInstance.patch(`/admin/course/${id}`, data);
  return response.data;
}

