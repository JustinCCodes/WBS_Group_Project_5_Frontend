import { cookies } from "next/headers";
import { UserSchema, type CurrentUser } from "./types";

// Server side functions
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
