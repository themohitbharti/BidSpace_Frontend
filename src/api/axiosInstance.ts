import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import config from "../config/config";
import { regenerateToken, TokenResponse } from "./auth";

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
});

// simple in‑memory holder (or use localStorage)
let accessToken: string | null = null;

export const setAccessToken = (t: string | null) => {
  accessToken = t;
};

// Add this getter function
export const getAccessToken = () => {
  return accessToken;
};

axiosInstance.interceptors.request.use((cfg) => {
  if (accessToken && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${accessToken}`;
  }
  return cfg;
});

let isRefreshing = false;
let queue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig & { _retry?: boolean };
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  queue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      // actually perform the retry and resolve with the real response
      axiosInstance(config)
        .then((res: AxiosResponse) => resolve(res))
        .catch((err: unknown) => reject(err));
    }
  });
  queue = [];
};

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    const originalRequest = err.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          queue.push({ resolve, reject, config: originalRequest });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      return regenerateToken()
        .then((response: TokenResponse) => {
          const newToken = response.data.accessToken;
          setAccessToken(newToken);
          processQueue(null, newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((refreshError: unknown) => {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
    return Promise.reject(err);
  },
);

export default axiosInstance;
