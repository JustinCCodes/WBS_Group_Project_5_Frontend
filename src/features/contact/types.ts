import { z } from "zod";

// Regex to find common link patterns case insensitive
const linkRegex =
  /(http|www\.|ftp\.|file:|\.com|\.net|\.org|\.io|\.dev|\.app)/i;

// Contact form schema with honeypot field for bot detection
export const ContactFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.email("Please enter a valid email address"),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(500, "Message must be 500 characters or less")
      .refine((val) => !linkRegex.test(val), {
        message: "Message cannot contain links or URLs",
      }),
    honeypot: z.string().optional(), // Hidden bot trap field
  })
  .refine((data) => !data.honeypot, {
    // If honeypot is filled this validation fails
    message: "Bot detected",
    path: ["honeypot"],
  });

export type ContactFormData = z.infer<typeof ContactFormSchema>;
