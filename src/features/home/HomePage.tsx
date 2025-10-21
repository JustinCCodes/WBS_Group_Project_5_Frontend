"use client";

import { useState } from "react";
import api from "@/shared/lib/api.";
import Button from "@/shared/components/ui/Button";

export default function HomePage() {
  const [apiResponse, setApiResponse] = useState<string>(
    "Click the button to test the backend connection."
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    setApiResponse("Connecting...");
    try {
      const response = await api.get("/");
      const message = response.data.message || JSON.stringify(response.data);
      setApiResponse(`✅ Success! Backend says: "${message}"`);
    } catch (error: any) {
      console.error("API connection test failed:", error);
      setApiResponse(
        `❌ Failed to connect. Is your backend running on the port specified in .env.local?`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Hello from Homepage</h1>
      <div className="mt-8">
        <Button onClick={handleTestConnection} disabled={isLoading}>
          {isLoading ? "Testing..." : "Test Backend Connection"}
        </Button>
      </div>
      <p className="mt-4 rounded-md p-4 font-mono text-sm">{apiResponse}</p>
    </div>
  );
}
