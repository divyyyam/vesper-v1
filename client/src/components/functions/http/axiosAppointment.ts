import axios from "axios";
import { backendUrl } from "@/store";

const axiosAppointment = axios.create({
  baseURL: `${backendUrl}/api/v1/appointment`,
  headers: { "Content-Type": "application/json" },
});



export default axiosAppointment;
