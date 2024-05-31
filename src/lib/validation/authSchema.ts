import { z } from "zod";

export const authSchema = z
  .object({
    username: z.string().min(6, "username must be atleast 6 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "password must be atleast 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
