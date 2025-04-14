import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "./index";
import { loginUser, getCurrentUser } from "../api/auth";
import { login as loginAction } from "../store/authSlice";
import axios from "axios";

interface LoginFormInputs {
    email: string;
    password: string;
  }

function Login(){

    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm<LoginFormInputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        try {
          setError(null);
          await loginUser(data);
          const userData = await getCurrentUser();
          dispatch(loginAction(userData));
          navigate("/");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              setError(error.response?.data?.message || "Login failed");
            } else if (error instanceof Error) {
              setError(error.message);
            } else {
              setError("Something went wrong");
            }
          }
      };


    return(
        <div className="flex w-full items-center justify-center">
      <div className="mx-auto w-full max-w-lg rounded-xl border bg-gray-100 p-10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
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
              {...register("email", { required: "Email is required" })}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
    )
}

export default Login