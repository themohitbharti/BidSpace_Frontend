import axiosInstance from "./axiosInstance";


interface LoginPayload {
    email: string;
    password: string;
  }

  export const loginUser = async (data: LoginPayload) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  };
  
  export const getCurrentUser = async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  };