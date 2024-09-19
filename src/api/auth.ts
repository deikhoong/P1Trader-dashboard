import { LoginForm, LoginResp } from "./api.types";
import axiosInstance from "./axios";

export const Login = async ( data:LoginForm ) => {
  const response = await axiosInstance.post<LoginResp>('/auth/admin/login', {
    ...data
  });

  return response.data;
};

export const Logout = async () => {
  try{
    const response = await axiosInstance.post('/auth/logout')
    return response.data;
  }catch(error){
    console.error(error);
    return null;
  }
}


