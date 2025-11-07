import api from "@/shared/lib/api";
import { ContactFormData, ContactFormSchema } from "./types";

// Sends the contact form message to the backend
export async function sendContactMessage(
  input: ContactFormData
): Promise<{ success: boolean; message: string }> {
  // Parses on the client as a first line of defense
  const payload = ContactFormSchema.parse(input);

  // Sends POST request to /contact endpoint
  const response = await api.post("/contact", payload);

  return response.data;
}
