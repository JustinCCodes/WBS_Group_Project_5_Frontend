import api from "@/shared/lib/api.";
import { z } from "zod";

export const LoginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["user", "admin"]),
});
export type User = z.infer<typeof UserSchema>;

const LoginResponseSchema = z.object({ user: UserSchema });
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export async function login(input: LoginInput): Promise<User> {
  const payload = LoginInputSchema.parse(input);
  const res = await api.post("/auth/login", payload);
  const data = LoginResponseSchema.parse(res.data);
  return data.user;
}

export async function refresh(): Promise<void> {
  await api.post("/auth/refresh");
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const res = await api.get("/users/me");
  return UserSchema.parse(res.data);
}
