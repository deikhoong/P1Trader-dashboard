import { Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetEvents = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/events', { params: pagination });
  return response.data;
}

export const DeleteEvents = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/events/${id}`);
  return response.data;
}


