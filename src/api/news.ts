import { NewsRequest, Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetNews = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/news', { params: pagination });
  return response.data;
}

export const GetNewsInfo = async (id: string) => {
  const response = await axiosInstance.get(`/admin/news/${id}`);
  return response.data;
}

export const CreateNews = async (data: NewsRequest) => {
  const response = await axiosInstance.post('/admin/news', data);
  return response.data;
}

export const UpdateNews = async (id: string, data: NewsRequest) => {
  const response = await axiosInstance.patch(`/admin/news/${id}`, data);
  return response.data;
}

export const DeleteNews = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/news/${id}`);
  return response.data;
}