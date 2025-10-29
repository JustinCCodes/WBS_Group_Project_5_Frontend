"use client";

import React, { useState, FormEvent } from "react";
import Button from "@/shared/components/ui/Button";
import { registerUser } from "@/features/auth/data";
import { getErrorMessage } from "@/shared/types";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const user = await registerUser({ name, email, password });
      setSuccess(`Account created for ${user.name}. Redirecting to login...`);
      setName("");
      setEmail("");
      setPassword("");
      router.push("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        getErrorMessage(err) || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Register</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="input input-bordered mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="input input-bordered mt-1 block w-full"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="input input-bordered mt-1 block w-full"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}
        <Button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}
