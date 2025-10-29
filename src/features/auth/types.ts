import { z } from "zod";

// Schemas
export const LoginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const RegisterInputSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["user", "admin"]),
});

export const LoginResponseSchema = z.object({ user: UserSchema });

// Types
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type User = z.infer<typeof UserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type CurrentUser = User | null;

export type BanInfo = {
  reason: string;
  until?: string;
};

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  banInfo: BanInfo | null;
  setBanInfo: (info: BanInfo | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};
