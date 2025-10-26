import { cookies } from "next/headers";
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.email(),
  role: z.enum(["user", "admin"]),
});
export type CurrentUser = z.infer<typeof UserSchema> | null;

export async function getCurrentUser(): Promise<CurrentUser> {
  cookies();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/users/me`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return UserSchema.parse(data);
  } catch {
    return null;
  }
}
