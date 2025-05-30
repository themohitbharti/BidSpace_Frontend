import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "../index";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

interface OTPFormInputs {
  otp: string;
}

// Define interface for user data from API response
interface UserData {
  _id: string;
  email: string;
  fullName: string;
  totalMoney: number;
  reservedMoney: number;
  productsListed: string[];
  productsPurchased: string[];
  createdAt: string;
  updatedAt: string;
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

      // Call the API directly with axiosInstance
      const response = await axiosInstance.post("/user/verify-otp", payload);
      const res = response.data;

      if (res?.success) {
        // Store user data in Redux
        const userData: UserData = res.data;

        // Dispatch login action with the necessary user data
        dispatch(
          login({
            _id: userData._id,
            email: userData.email,
            fullName: userData.fullName,
          }),
        );

        setSuccessMsg(res.message || "Account verified successfully");

        // Redirect to login after successful verification
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
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
