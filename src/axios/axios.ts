import axios from "axios";

const instance = axios.create({
  baseURL: "https://628c-202-166-220-144.ngrok-free.app/",
});

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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 error");
    }
    return Promise.reject(error);
  }
);

export default instance;
