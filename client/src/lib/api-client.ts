import axios from "axios";
import Cookies from "js-cookie";
import { HOST, LOGIN_ROUTE, SIGNUP_ROUTE } from "./constants";

const apiClient = axios.create({
  baseURL: HOST,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");

    if (
      token &&
      !config.url?.includes(LOGIN_ROUTE) &&
      !config.url?.includes(SIGNUP_ROUTE)
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
