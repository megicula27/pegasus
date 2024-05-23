import { string, z } from "zod";
export const loginSchema = z.object({
  identifier: z.string().min(1, "please enter your username or email address"),
  password: z.string().min(1, "please enter your password"),
});
