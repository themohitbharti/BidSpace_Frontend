import axiosInstance from "./axiosInstance";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload extends LoginPayload {
  fullName: string;
}

interface VerifyOTPPayload extends SignupPayload {
  otp: string;
}

export const loginUser = async (data: LoginPayload) => {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
};

export const registerUser = async (data: SignupPayload) => {
  const response = await axiosInstance.post("/user/register", data);
  return response.data;
};

export const verifyOTP = async (data: VerifyOTPPayload) => {
  const response = await axiosInstance.post("/user/verify-otp", data);
  return response.data;
};

export const logoutUser = async (token: string) => {
  const response = await axiosInstance.post(
    "/user/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
