import api from "@/shared/lib/api";
import {
  LoginInput,
  LoginInputSchema,
  RegisterInput,
  RegisterInputSchema,
  User,
  UserSchema,
} from "./types";
import { z } from "zod";

// Auth API Functions
const LoginResponseSchema = z.object({ user: UserSchema });

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

// User API Functions
export async function registerUser(input: RegisterInput): Promise<User> {
  const payload = RegisterInputSchema.parse(input);
  const res = await api.post("/users", payload);
  const user = UserSchema.parse(res.data);
  return user;
}
