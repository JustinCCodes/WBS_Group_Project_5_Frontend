import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

// Axios instance that points to proxied API route
const api: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // For sending cookies
});

// --- 401 -> refresh token handling with a simple queue ---
let isRefreshing = false;
let pendingQueue: Array<(ok: boolean) => void> = [];

const processQueue = (ok: boolean) => {
  pendingQueue.forEach((cb) => cb(ok));
  pendingQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const status = (error.response && error.response.status) || 0;
    const isAuthPath = Boolean(
      original?.url && original.url.startsWith("/auth/")
    );
    const isRefreshCall = Boolean(
      original?.url && original.url.startsWith("/auth/refresh")
    );

    if (status === 401 && original && !original._retry && !isAuthPath) {
      original._retry = true;

      if (isRefreshing) {
        const ok = await new Promise<boolean>((resolve) =>
          pendingQueue.push(resolve)
        );
        if (!ok) return Promise.reject(error);
        return api(original);
      }

      isRefreshing = true;
      try {
        await api.post("/auth/refresh");
        processQueue(true);
        return api(original);
      } catch (refreshErr) {
        processQueue(false);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // If the refresh call itself fails or any other error
    if (isRefreshCall) {
      processQueue(false);
    }

    return Promise.reject(error);
  }
);

export default api;
