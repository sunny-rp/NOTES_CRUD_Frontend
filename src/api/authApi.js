import API from "./axiosInstance.js";

const registerUser = async (userData) => API.post("users/register", userData);
const loginUser = async (userData) => API.post("users/login", userData);
const logoutUser = async () => API.post("users/logout");

export { registerUser, logoutUser, loginUser };
