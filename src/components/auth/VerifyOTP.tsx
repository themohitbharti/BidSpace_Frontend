import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Logo, LoadingSpinner } from "../index";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { loginUser } from "../../api/auth"; // Add this import at the top
import { setAccessToken } from "../../api/axiosInstance";

interface OTPFormInputs {
  otp: string;
}

function VerifyOTP() {
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
  const { register, handleSubmit } = useForm<OTPFormInputs>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get data passed from the signup page
  const { email, fullName, password } = location.state || {};

  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    try {
      setError(null);
      setSuccessMsg(null);
      setIsLoading(true); // Set loading state to true when submission starts

      if (!email || !fullName || !password) {
        throw new Error("Missing user information. Please sign up again.");
      }

      const payload = {
        email,
        otp: data.otp,
        fullName,
        password,
      };

      // First verify the OTP
      const response = await axiosInstance.post("/user/verify-otp", payload);
      const res = response.data;

      if (res?.success) {
        setSuccessMsg(res.message || "Account verified successfully");

        // Now automatically log the user in with the credentials we already have
        try {
          const loginResponse = await loginUser({
            email,
            password,
          });

          if (loginResponse?.success) {
            const { accessToken } = loginResponse.data[0];
            const user = loginResponse.user;

            // Set the token and user state
            setAccessToken(accessToken);
            dispatch(login(user));

            // Redirect to home page instead of login page
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            throw new Error(loginResponse.message || "Auto-login failed");
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          // Still consider verification successful, but redirect to login page as fallback
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        throw new Error(res.message || "Verification failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Verification failed");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false); // Set loading state back to false regardless of success/error
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-lg rounded-xl border bg-gray-100 p-10 shadow-lg">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo size="default" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800">
          Verify Your Account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Please enter the OTP sent to {email || "your email"}
        </p>

        {error && <p className="mt-8 text-center text-red-600">{error}</p>}
        {successMsg && (
          <p className="mt-8 text-center text-green-600">{successMsg}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="OTP"
              placeholder="Enter OTP"
              type="text"
              {...register("otp", { required: "OTP is required" })}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;
