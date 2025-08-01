import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "../index";
import { loginUser } from "../../api/auth";
import { login as loginAction } from "../../store/authSlice";
import axios from "axios";
import { setAccessToken } from "../../api/axiosInstance";
import { setCurrentAccessToken } from "../../utils/auth"; // Add this import

interface LoginFormInputs {
  email: string;
  password: string;
}

function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setError(null);
      setIsLoading(true); // Set loading to true when submission starts

      const res = await loginUser(data);

      if (res?.success) {
        const { accessToken } = res.data[0];
        const user = res.user;

        setAccessToken(accessToken); // Your existing axios setup
        setCurrentAccessToken(accessToken); // Sync with WebSocket context
        dispatch(loginAction(user));
        navigate("/");
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false); // Set loading to false when done
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
          Log in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="mt-8 text-center text-red-600">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              onFocus={() => setError(null)}
              {...register("email", { required: "Email is required" })}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              onFocus={() => setError(null)}
              {...register("password", { required: "Password is required" })}
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
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
