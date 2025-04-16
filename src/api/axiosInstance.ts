
import axios from "axios";
import config from "../config/config";

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl || "http://localhost:5000/api",
  withCredentials: true, // If you're using cookies
});

export default axiosInstance;
