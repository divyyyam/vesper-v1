import axiosAuth from "../http/axiosAuth";

interface ApiResponse {
  success: boolean;
  token: string;
  email: string;
  id: string;
  name?: string;
  stateRollNumber?: string;
  specialization?: string;
  message?: string;
}

interface LoginPayload {
  email: string;
  password: string;
  stateRollNumber?: string;
}

interface RegisterAdvPayload extends LoginPayload {
  name: string;
  stateRollNumber: string;
  specialization: string;
}

interface RegisterUserPayload extends LoginPayload {
  name: string;
}

export const getAuthData = () => {
  try {
    return {
      token: localStorage.getItem("token"),
      id: localStorage.getItem("id"),
      email: localStorage.getItem("email"),
      name: localStorage.getItem("name"),
      role: localStorage.getItem("role"),
    };
  } catch (error) {
    console.error("Failed to retrieve authentication data:", error);
    return null;
  }
};

export const clearAuth = (): void => {
  try {
    ["token", "id", "email", "name", "role"].forEach((key) =>
      localStorage.removeItem(key),
    );
  } catch (error) {
    console.error("Failed to clear authentication data:", error);
  }
};

const persistAuth = (data: ApiResponse, role: "user" | "lawyer") => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("id", data.id);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", role);
  if (data.name) localStorage.setItem("name", data.name);
  else localStorage.removeItem("name");
};

export const registerAdv = async (payload: RegisterAdvPayload): Promise<ApiResponse> => {
  const response = await axiosAuth.post<ApiResponse>("/register-adv", payload);
  if (response.data.success) persistAuth(response.data, "lawyer");
  return response.data;
};

export const loginAdv = async (payload: LoginPayload): Promise<ApiResponse> => {
  const response = await axiosAuth.post<ApiResponse>("/login-adv", payload);
  if (response.data.success) persistAuth(response.data, "lawyer");
  return response.data;
};

export const registerUser = async (payload: RegisterUserPayload): Promise<ApiResponse> => {
  const response = await axiosAuth.post<ApiResponse>("/register-user", payload);
  if (response.data.success) persistAuth(response.data, "user");
  return response.data;
};

export const loginUser = async (payload: LoginPayload): Promise<ApiResponse> => {
  const response = await axiosAuth.post<ApiResponse>("/login-user", payload);
  if (response.data.success) persistAuth(response.data, "user");
  return response.data;
};

export const isAuthenticated = (): boolean => Boolean(localStorage.getItem("token"));
export const getUserRole = (): string | null => localStorage.getItem("role");
export const getAuthToken = (): string | null => localStorage.getItem("token");
export const getUserId = (): string | null => localStorage.getItem("id");
export const getUserEmail = (): string | null => localStorage.getItem("email");
export const getUserName = (): string | null => localStorage.getItem("name");
