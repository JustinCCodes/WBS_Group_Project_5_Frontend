//  Server Side API Client

import axios, { AxiosInstance } from "axios";

// Get the backend URL from environment variables
// Falls back to localhost if not set
const getBaseURL = () => {
  // For server side rendering use the non public env variable
  const baseURL =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseURL) {
    // In production, this should fail - environment variables must be set
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "API_BASE_URL or NEXT_PUBLIC_API_BASE_URL must be set in production"
      );
    }
    // Development fallback
    return "http://localhost:8000/api/v1";
  }

  return baseURL;
};

// Creates axios instance for server side API calls
const apiServer: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiServer;
