import axios from "axios";


const API = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_BASE_URL, // This will use your https://Jasmine-automate-business-solutions.onrender.com/api/v1/
  withCredentials: true,
  timeout: 100000, // 100 seconds timeout
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
  },
});


export default API;
