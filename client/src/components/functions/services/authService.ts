import axiosAuth from "../http/axiosAuth";
interface ApiResponse {
  success: boolean;
  token: string;
  email: string;
  id: string;
  name: string;
  stateRollNumber?: string;
  message?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterAdvPayload extends LoginPayload {
  name: string;
  stateRollNumber: string;
  
}

interface RegisterUserPayload extends LoginPayload {
  name: string;
   
}
 
export const getAuthData = () => {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");
    
    if (token && id && email && name && role) {
    }
    return { token, id, email, name, role };
    return null;
  } catch (error) {
    console.error("Failed to retrieve authentication data:", error);
    return null;
  }
};

 
export const clearAuth = (): void => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
  } catch (error) {
    console.error("Failed to clear authentication data:", error);
  }
};

 
export const registerAdv = async (payload: RegisterAdvPayload): Promise<ApiResponse> => {
  try {
    const res = await axiosAuth.post<ApiResponse>("/register-adv", payload);
    
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", "lawyer");
    }
    
    return res.data;
  } catch (error: any) {
    console.error("Lawyer registration failed:", error.response?.data || error.message);
    throw error;
  }
};

 
export const loginAdv = async (payload: LoginPayload): Promise<ApiResponse> => {
  try {
    const res = await axiosAuth.post<ApiResponse>("/login-adv", payload);
    
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", "lawyer");
    }
    
    return res.data;
  } catch (error: any) {
    console.error("Lawyer login failed:", error.response?.data || error.message);
    throw error;
  }
};

 
export const registerUser = async (payload: RegisterUserPayload): Promise<ApiResponse> => {
  try {
    const res = await axiosAuth.post<ApiResponse>("/register-user", payload);
    
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", "user");
    }
    
    return res.data;
  } catch (error: any) {
    console.error("User registration failed:", error.response?.data || error.message);
    throw error;
  }
};

 
export const loginUser = async (payload: LoginPayload): Promise<ApiResponse> => {
  try {
    const res = await axiosAuth.post<ApiResponse>("/login-user", payload);
    
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("role", "user");
    }
    
    return res.data;
  } catch (error: any) {
    console.error("User login failed:", error.response?.data || error.message);
    throw error;
  }
};

 
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

 
export const getUserRole = (): string | null => {
  return localStorage.getItem("role");
};
 
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};


export const getUserId = (): string | null => {
  return localStorage.getItem("id");
};

 
export const getUserEmail = (): string | null => {
  return localStorage.getItem("email");
};

 
export const getUserName = (): string | null => {
  return localStorage.getItem("name");
};