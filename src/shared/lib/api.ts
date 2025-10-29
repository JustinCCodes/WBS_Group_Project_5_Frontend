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

  const reasonMatch = errorMessage.match(
    /Reason:\s*(.+?)(?:\s+Banned until:|$)/
  );
  const untilMatch = errorMessage.match(/Banned until:\s*(.+?)$/);

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

export const setGlobalBanHandler = (
  handler: (banInfo: { reason: string; until?: string }) => void
) => {
  globalBanHandler = handler;
};

// Axios instance that points to proxied API route
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // For sending cookies
  timeout: 30000, // 30 second timeout
});

// Interceptor to handle 401 responses and refresh token logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original) {
      return Promise.reject(error);
    }

    const status = (error.response && error.response.status) || 0;
    const isAuthPath = Boolean(
      original.url && original.url.startsWith("/auth/")
    );
    const isRefreshCall = Boolean(
      original.url &&
        (original.url === "/auth/refresh" || original.url.endsWith("/refresh"))
    );

    // Checks for 403 ban status
    if (status === 403 && error.response?.data) {
      const errorData = error.response.data as { error?: string };
      if (errorData.error) {
        const banInfo = parseBanInfo(errorData.error);
        if (banInfo && globalBanHandler) {
          globalBanHandler(banInfo);
          return Promise.reject(error);
        }
      }
    }

    // Handle 401 Unauthorized - try to refresh token
    if (status === 401 && !original._retry && !isRefreshCall) {
      if (
        original.url?.includes("/auth/login") ||
        original.url?.includes("/auth/register") ||
        (original.url?.includes("/users") &&
          original.method?.toLowerCase() === "post")
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queues this request to retry after refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            original._retry = true;
            return api(original);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // Attempts to refresh the token
        await api.post("/auth/refresh", {}, {
          withCredentials: true,
          _retry: true, // Prevents infinite loop
        } as AxiosRequestConfig & { _retry?: boolean });

        processQueue(null); // Resolves all queued requests
        return api(original); // Retries the original request
      } catch (refreshError) {
        processQueue(refreshError); // Rejects all queued requests

        // If refresh fails redirect to login
        if (typeof window !== "undefined") {
          // Clears any stored state
          window.localStorage.removeItem("user");
          // Only redirects if not already on login/register page
          if (!window.location.pathname.match(/^\/(login|register)/)) {
            window.location.href = "/login";
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Proactive token refresh calls this periodically to refresh before expiry
export const proactiveRefresh = async (): Promise<boolean> => {
  try {
    await api.post("/auth/refresh", {}, {
      withCredentials: true,
      _retry: true,
    } as AxiosRequestConfig & { _retry?: boolean });
    return true;
  } catch (error) {
    console.error("Proactive refresh failed:", error);
    return false;
  }
};

export default api;
