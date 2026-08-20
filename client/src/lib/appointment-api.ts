import { backendUrl } from "@/store";

export interface Lawyer {
  id: string;
  name: string;
  email: string;
  specialization: string | null;
  stateRollNumber: string;
}

export interface AppointmentParty {
  name: string | null;
  email: string | null;
  walletAddress?: string | null;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  reason: string;
  userEmail?: string;
  lawyerEmail?: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  user?: AppointmentParty | null;
  lawyer?: AppointmentParty | null;
}

export interface CreateAppointmentInput {
  title: string;
  description: string;
  reason: string;
  userEmail: string;
  lawyerEmail: string;
  scheduledAt: string;
}

interface ListResponse {
  success: boolean;
  appointments: Appointment[];
  message?: string;
}

interface LawyersResponse {
  success: boolean;
  data: Lawyer[];
  message?: string;
}

interface MutationResponse {
  success: boolean;
  message?: string;
  appointment?: Appointment;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await fetch(`${backendUrl}/api/v1/appointment${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) throw new Error(data.message || `Request failed with status ${response.status}`);
  return data;
}

export async function getLawyers() {
  const response = await request<LawyersResponse>("/all-lawyers");
  if (!response.success) throw new Error(response.message || "Failed to load lawyers");
  return response.data;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const response = await request<MutationResponse>("/add-appointment", {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!response.success) throw new Error(response.message || "Failed to create appointment");
  return response;
}

export async function getUserAppointments(email: string) {
  const response = await request<ListResponse>(`/user/${encodeURIComponent(email)}?limit=100&offset=0`);
  if (!response.success) throw new Error(response.message || "Failed to load appointments");
  return response.appointments;
}

export async function getLawyerAppointments(email: string) {
  const response = await request<ListResponse>(`/lawyer/${encodeURIComponent(email)}?limit=100&offset=0`);
  if (!response.success) throw new Error(response.message || "Failed to load appointments");
  return response.appointments;
}

export async function deleteAppointment(id: string) {
  const response = await request<MutationResponse>(`/remove-appointment/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!response.success) throw new Error(response.message || "Failed to cancel appointment");
  return response;
}
