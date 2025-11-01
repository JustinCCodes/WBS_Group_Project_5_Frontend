import { z } from "zod";

// Schemas
export const LoginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

// Registration input schema with strong password requirements
export const RegisterInputSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
    ),
});

// User schema
export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["user", "admin"]),
});

// Login response schema
export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.string().optional(),
});

// Types
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type User = z.infer<typeof UserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type CurrentUser = User | null;

// Ban information type
export type BanInfo = {
  reason: string;
  until?: string;
};

// Auth context value type
export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  banInfo: BanInfo | null;
  setBanInfo: (info: BanInfo | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};
