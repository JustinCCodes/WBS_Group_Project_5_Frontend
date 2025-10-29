//  Server Side API Client

import axios, { AxiosInstance } from "axios";

// Get the backend URL from environment variables
// Falls back to localhost if not set
const getBaseURL = () => {
  // For server side rendering use the non public env variable
  const baseURL =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseURL) {
    console.warn(
      "API_BASE_URL or NEXT_PUBLIC_API_BASE_URL not set. Falling back to http://localhost:8000/api/v1"
    );
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
    if (error.response) {
      // Server responded with error status
      console.error(
        `[Server API Error] ${error.response.status}: ${
          error.response.data?.message || error.message
        }`
      );
    } else if (error.request) {
      // Request made but no response received
      console.error("[Server API Error] No response received:", error.message);
    } else {
      // Error in request setup
      console.error("[Server API Error]", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiServer;
