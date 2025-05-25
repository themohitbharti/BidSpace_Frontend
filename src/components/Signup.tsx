import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "./index";
import { registerUser } from "../api/auth"; // <-- you'll create this
import axios from "axios";

interface SignupFormInputs {
  fullName: string;
  email: string;
  password: string;
}

function Signup() {
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<SignupFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      setError(null);
      setSuccessMsg(null);

      const res = await registerUser(data);

      if (res?.success) {
        setSuccessMsg(res.message); // "OTP sent to email..."
        // Pass all user data to the verify-otp page
        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email: data.email,
              fullName: data.fullName,
              password: data.password,
            },
          });
        }, 2000);
      } else {
        throw new Error(res.message || "Signup failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Signup failed");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
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
          Create a new account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log In
          </Link>
        </p>
        {error && <p className="mt-8 text-center text-red-600">{error}</p>}
        {successMsg && (
          <p className="mt-8 text-center text-green-600">{successMsg}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
              onFocus={() => setError(null)}
              {...register("fullName", { required: "Full name is required" })}
            />
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
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
