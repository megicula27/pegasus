"use client";

import React from "react";
import { authSchema } from "@/lib/validation/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

type SignupFormInput = z.infer<typeof authSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(authSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: SignupFormInput) => {
    try {
      const response = await axios.post("/api/auth/signup", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        toast.success("Signup successful");
        router.push("/login");
      } else {
        toast.error(response.data.message || "Signup unsuccessful");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup unsuccessful");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center text-white">
          Sign Up
        </h2>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-white"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username")}
            className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-white"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
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
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-white"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Sign Up
        </button>
      </form>
      <div>
        <p className="text-white">
          Already registered? kindly{" "}
          <Link
            className="text-indigo-500 hover:text-indigo-400 underline"
            href="/login"
          >
            login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
