import { Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetUsers = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/users', { params: pagination });
  return response.data;
}