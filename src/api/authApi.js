import API from "./axiosInstance.js";

export const registerUser = (userData) => API.post("/users/register", userData);

export const verifyOtp = (data) => API.post("/users/register/verify-otp", data);
// data: { otpId, otp }

export const resendOtp = (data) => API.post("/users/register/resend-otp", data);
// data: { otpId }

export const loginUser = (userData) => API.post("/users/login", userData);

export const logoutUser = () => API.post("/users/logout", {}, { withCredentials: true });
