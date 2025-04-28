/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const instance = axios.create({
  // baseURL: "https://d77f-202-166-220-144.ngrok-free.app/",
  baseURL: "http://10.31.31.76:8008/",
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
});

// let isRefreshing = false;
// let failedRequest: any[] = [];

// for request interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//for response
instance.interceptors.response.use(
  (response) => {
    if (response.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // check if error is 401 and is not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.includes("/auth/refresh")
    ) {
      //if already refreshing, add to queue
      // if (isRefreshing) {
      //   return new Promise((resolve, reject) => {
      //     failedRequest.push({
      //       resolve: () => resolve(instance(originalRequest)),
      //       reject: () => reject(error),
      //     });
      //   });
      // }
      originalRequest._retry = true;
      // isRefreshing = true;

      try {
        //call refresh token endpoint
        const { data } = await instance.post("/auth/refresh");

        //store new tokens
        localStorage.setItem("accessToken", data.accessToken);
        // localStorage.setItem("accessToken", data.refreshToken);

        //update authorization header
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;

        //retry all queued request
        // failedRequest.forEach((request) => request.reject());
        // failedRequest = [];

        //retry the original request
        return instance(originalRequest);
      } catch (refreshError) {
        //clear token and redirect to login if refresh fails
        // failedRequest.forEach((request) => request.reject());
        // failedRequest = [];

        localStorage.removeItem("accessToken");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
