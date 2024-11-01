import { EventRequest, Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetEvents = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/events', { params: pagination });
  return response.data;
}

export const GetEvent = async (id: string) => {
  const response = await axiosInstance.get(`/admin/events/${id}`);
  return response.data;
}

export const CreateEvent = async (data: EventRequest) => {
  const response = await axiosInstance.post('/admin/events', data);
  return response.data;
}

export const UpdateEvent = async (id: string, data: EventRequest) => {
  const response = await axiosInstance.patch(`/admin/events/${id}`, data);
  return response.data;
}

export const DeleteEvents = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/events/${id}`);
  return response.data;
}


