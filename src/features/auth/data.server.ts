import { cookies } from "next/headers";
import { UserSchema, type CurrentUser } from "./index";

// Server side functions
export async function getCurrentUser(): Promise<CurrentUser> {
  cookies();
  try {
    // Fetches current user data from the API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/users/me`,
      {
        credentials: "include", // Include cookies
        cache: "no-store", // Always fetch fresh data
      }
    );
    if (!res.ok) return null; // Not logged in
    const data = await res.json(); // User data
    return UserSchema.parse(data); // Validate and return user
  } catch {
    return null;
  }
}
