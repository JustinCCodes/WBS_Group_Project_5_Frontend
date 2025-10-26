import api from "@/shared/lib/api.";
import { z } from "zod";
import { UserSchema, type User } from "./authClient";

export const RegisterInputSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export async function registerUser(input: RegisterInput): Promise<User> {
  const payload = RegisterInputSchema.parse(input);
  const res = await api.post("/users", payload);
  const user = UserSchema.parse(res.data);
  return user;
}
