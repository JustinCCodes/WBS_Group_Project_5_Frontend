import api from "@/shared/lib/api";
import {
  LoginInput,
  LoginInputSchema,
  LoginResponseSchema,
  RegisterInput,
  RegisterInputSchema,
  User,
  UserSchema,
} from "./types";

// Auth API Functions
export async function login(input: LoginInput): Promise<User> {
  const payload = LoginInputSchema.parse(input);
  const res = await api.post("/auth/login", payload);
  const data = LoginResponseSchema.parse(res.data);
  return data.user;
}

// Refreshes the authentication token
export async function refresh(): Promise<void> {
  await api.post("/auth/refresh");
}

// Gets a valid access token refreshing if necessary
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

// Fetches current user data
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
