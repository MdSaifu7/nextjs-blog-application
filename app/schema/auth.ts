import z from "zod";
export const SignUpSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.email(),
  password: z.string().min(8).max(30),
});

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(30),
});
