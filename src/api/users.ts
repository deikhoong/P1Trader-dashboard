import { CreateUserRequest, Pagination, UpdateUserRequest } from "./api.types";
import axiosInstance from "./axios";

export const GetUsers = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/users', { params: pagination });
  return response.data;
}

export const CreateUser = async (data: CreateUserRequest) => {
  const response = await axiosInstance.post('/admin/users', data);
  return response.data;
}

export const GetUser = async (id: string) => {
  const response = await axiosInstance.get(`/admin/users/${id}`);
  return response.data;
}

export const UpdateUser = async (id: string, data: UpdateUserRequest) => {
  const response = await axiosInstance.patch(`/admin/users/${id}`, data);
  return response.data;
}

export const DeleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
}


