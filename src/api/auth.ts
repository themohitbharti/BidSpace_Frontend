import axiosInstance from "./axiosInstance";


interface LoginPayload {
    email: string;
    password: string;
  }

  export const loginUser = async (data: LoginPayload) => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data;
  };