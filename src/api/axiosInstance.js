import axios from "axios"
import { store } from "../redux/store"
import { signoutSuccess } from "../redux/user/userSlice"

const API = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 100000,
  headers: {
    Accept: "application/json",
  },
})

// 🔥 RESPONSE INTERCEPTOR (AUTO LOGOUT ON TOKEN EXPIRE)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      store.dispatch(signoutSuccess());
      window.location.href = "/login";
      return; // stop further
    }

    return Promise.reject(error);
  }
);

export default API
