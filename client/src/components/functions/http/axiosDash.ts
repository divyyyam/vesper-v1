import axios from "axios";
import { backendUrl } from "@/store";

export const dash = axios.create({
  baseURL: `${backendUrl}/api/v1/appointment`,
  headers: { "Content-Type": "application/json" },
});
