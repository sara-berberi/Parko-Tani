import axios from "axios";

const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000";
console.log(`Using API base URL: ${API_BASE}`);
export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // simple pass-through; could add global toast here
    return Promise.reject(err);
  },
);
