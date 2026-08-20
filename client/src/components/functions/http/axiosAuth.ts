import axios from "axios";
import { backendUrl } from "@/store";

const axiosAuth = axios.create({
  baseURL: `${backendUrl}/api/v1/auth`,
  headers: { "Content-Type": "application/json" },
});



export default axiosAuth;
