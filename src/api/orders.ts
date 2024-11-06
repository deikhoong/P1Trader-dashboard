import { Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetOrders = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/orders', { params: pagination });
  return response.data;
}