import { CreateUserReq, Pagination } from "./api.types";
import axiosInstance from "./axios";

export const GetUsers = async (pagination: Pagination) => {
  const response = await axiosInstance.get('/admin/users', { params: pagination });
  return response.data;
}

export const CreateUser = async (data: CreateUserReq) => {
  const response = await axiosInstance.post('/admin/users', data);
  return response.data;
}


export type CreateUser = {
  email: string;
  password: string;
  nickname: string;
}

