"use client";

import React from "react";
import { loginSchema } from "@/lib/validation/loginSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginSchemaInput = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: LoginSchemaInput) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });
      console.log("Login", result);

      if (result?.error) {
        toast.error(result.error || "Login unsuccessful");
      } else {
        toast.success("Login Successful");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login unsuccessful");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 mb-4 bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center text-white">
          Login
        </h2>
        <div className="mb-4">
          <label
            htmlFor="identifier"
            className="block mb-2 text-sm font-medium text-white"
          >
            Username or Email
          </label>
          <input
            id="identifier"
            type="text"
            {...register("identifier")}
            className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.identifier && (
            <p className="mt-2 text-sm text-red-500">
              {errors.identifier.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-white"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
      <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-white">
          New to the website? Kindly{" "}
          <Link
            href="/signup"
            className="text-indigo-500 hover:text-indigo-400 underline"
          >
            Signup
          </Link>{" "}
          for joining tournaments and many more features.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
