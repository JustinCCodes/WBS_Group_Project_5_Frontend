import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Function to parse ban info from error message
export const parseBanInfo = (
  errorMessage: string
): { reason: string; until?: string } | null => {
  if (!errorMessage.includes("Account is banned")) {
    return null;
  }

  // Extracts reason and until date using regex
  const reasonMatch = errorMessage.match(
    /Reason:\s*(.+?)(?:\s+Banned until:|$)/
  );
  // Extracts until date if present
  const untilMatch = errorMessage.match(/Banned until:\s*(.+?)$/);

  // Builds ban info object
  const reason = reasonMatch
    ? reasonMatch[1].trim()
    : "Your account has been banned.";
  const until = untilMatch ? untilMatch[1].trim() : undefined;

  return { reason, until };
};

// Global ban handler
let globalBanHandler:
  | ((banInfo: { reason: string; until?: string }) => void)
  | null = null;

// Function to set the global ban handler
export const setGlobalBanHandler = (
  handler: (banInfo: { reason: string; until?: string }) => void
) => {
  globalBanHandler = handler;
};

// Gets the base URL for API requests
const getBaseURL = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseURL) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CRITICAL: NEXT_PUBLIC_API_BASE_URL is not set in production."
      );
      return "/api"; // Fallback but it will fail
    }
    // Development fallback
    return "http://localhost:8000/api/v1";
  }
  return baseURL;
};

const getAuthBaseURL = () => {
  const baseURL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;

  if (!baseURL) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CRITICAL: NEXT_PUBLIC_AUTH_SERVER_URL is not set in production."
      );
      return "/api/auth"; // Fallback but it will fail
    }
    // Development fallback
    return "http://localhost:8001/api/v1/auth";
  }
  return baseURL;
};

// Axios instance that points to the FULL backend URL
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(), // <-- Use the function
  withCredentials: true, // For sending cookies
  timeout: 30000, // 30 second timeout
});

// Interceptor to handle 401 responses and refresh token logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Processes the queued requests after token refresh
const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor to ensure credentials are always included
api.interceptors.request.use(
  (config) => {
    // Ensures credentials are included in every request
    config.withCredentials = true;

    // Attach CSRF token for state-changing requests (double submit cookie pattern)
    try {
      // Only adds to methods that modify state
      const method = (config.method || "get").toLowerCase();
      if (["post", "put", "patch", "delete"].includes(method)) {
        // Reads csrfToken cookie (non-httpOnly cookie set by backend)
        if (typeof window !== "undefined") {
          const match = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
          if (match && match[1]) {
            config.headers = config.headers || {};
            (config.headers as Record<string, string>)["X-CSRF-Token"] =
              decodeURIComponent(match[1]);
          }
        }
      }
    } catch {
      // Silent fail request continues without CSRF token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // If no original request reject
    if (!original) {
      return Promise.reject(error);
    }

    // Extract status and path information
    const status = (error.response && error.response.status) || 0;

    // We get the full auth URL now
    const authBaseURL = getAuthBaseURL();
    const refreshPath = authBaseURL.replace(getBaseURL(), "") + "/refresh"; // e.g., /auth/refresh

    // Checks if the request is a refresh call
    const isRefreshCall = Boolean(
      original.url &&
        (original.url === refreshPath || original.url.endsWith("/refresh"))
    );

    // Checks for 403 ban status
    if (status === 403 && error.response?.data) {
      // Parses the error message for ban information
      const errorData = error.response.data as { error?: string };
      // If the error message contains ban information, call the global ban handler
      if (errorData.error) {
        const banInfo = parseBanInfo(errorData.error);
        // If the ban info is valid and a global handler is set, call it
        if (banInfo && globalBanHandler) {
          globalBanHandler(banInfo);
          return Promise.reject(error);
        }
      }
    }

    // Handles 401 Unauthorized try to refresh token
    if (status === 401 && !original._retry && !isRefreshCall) {
      // Checks if the request is a login or registration attempt
      if (
        original.url?.includes("/auth/login") ||
        original.url?.includes("/auth/register") ||
        (original.url?.includes("/users") &&
          original.method?.toLowerCase() === "post")
      ) {
        // If the request is a login or registration attempt reject it
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queues this request to retry after refresh completes
        return (
          new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            // Waits for the token refresh to complete
            .then(() => {
              original._retry = true;
              return api(original);
            })
            // Catches any errors during the retry
            .catch((err) => {
              return Promise.reject(err);
            })
        );
      }

      // Marks the request as retried
      original._retry = true;
      isRefreshing = true;

      try {
        // Create a separate client for auth to avoid interceptor loops
        const authApi = axios.create({
          baseURL: getAuthBaseURL(),
          withCredentials: true,
        });

        // Attempts to refresh the token
        await authApi.post(
          "/refresh",
          {},
          { _retry: true } as any // Prevents infinite loop
        );

        processQueue(null); // Resolves all queued requests
        return api(original); // Retries the original request
      } catch (refreshError) {
        processQueue(refreshError); // Rejects all queued requests

        // If refresh fails clear any stored client state and let
        // the application UI decide whether to navigate to /login.
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("user");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
