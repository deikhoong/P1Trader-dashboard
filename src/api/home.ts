
import {  Pagination, StudentSaysRequest } from "./api.types";
import axiosInstance from "./axios";

export const GetStudentSayVideos = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/student-says', { params: pagination });
  return response.data;
}

export const CreatedStudentSay = async (data: StudentSaysRequest) => {
  const response = await axiosInstance.post('/admin/student-says', data);
  return response.data;
}

export const DeleteStudentSays = async (id: number) => {
  const response = await axiosInstance.delete(`/admin/student-says/${id}`);
  return response.data;
}
 
