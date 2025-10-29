// API Error Response Type
export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// Helper function to extract error message from API errors
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  const apiError = error as ApiErrorResponse;
  return (
    apiError?.response?.data?.error ||
    apiError?.response?.data?.message ||
    apiError?.message ||
    "An unexpected error occurred"
  );
}
