"use client";

import React, { useState, FormEvent } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { ContactFormData, ContactFormSchema } from "../types";
import { sendContactMessage } from "../data";
import { getErrorMessage } from "@/shared/lib/utils";
import { CheckCircle } from "lucide-react";

// Contact form component
export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
    honeypot: "", // Honeypot field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handles input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validates on the client
      ContactFormSchema.parse(formData);

      // Sends to backend
      await sendContactMessage(formData);

      // Shows success
      setSuccess(true);
      toast.success("Message sent successfully!");
    } catch (err) {
      let errorMessage = "An unknown error occurred.";
      if (err instanceof z.ZodError) {
        // Uses first validation error
        errorMessage = err.issues[0]?.message || errorMessage;
      } else {
        errorMessage = getErrorMessage(err);
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If successful show thank you message instead of form
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-white min-h-[300px]">
        <CheckCircle className="w-16 h-16 text-green-400 mb-6" />
        <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-gray-400">
          Thanks for reaching out. We'll get back to you soon (if this were a
          real site).
        </p>
      </div>
    );
  }

  // Style classes
  const inputClass =
    "w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* HONEYPOT FIELD */}
      <div
        className="absolute"
        style={{ left: "-5000px", top: "0" }}
        aria-hidden="true"
      >
        <label htmlFor="honeypot">Do not fill this out</label>
        <input
          type="text"
          id="honeypot"
          name="honeypot"
          value={formData.honeypot}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
          className={inputClass}
          placeholder="Your Name"
        />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
          className={inputClass}
          placeholder="your.email@example.com"
        />
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          disabled={loading}
          className={`${inputClass} min-h-[120px]`}
          placeholder="Your message... (min 10 chars, max 500, no links)"
          rows={5}
        />
      </div>
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
