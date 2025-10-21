import axios from "axios";

// Axios instance that points to proxied API route
const api = axios.create({
  baseURL: "/api",
});

export default api;
