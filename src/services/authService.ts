import { apiClient, ApiResponse } from "../lib/api";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export class AuthService {
  static async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      console.log("Attempting login with:", { email: credentials.email });
      console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);

      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      console.log("Login response:", response);

      if (response.success && response.data) {
        // Store the token in the API client
        apiClient.setToken(response.data.token);
        return response.data;
      }

      throw new Error(response.message || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove token even if logout request fails
      apiClient.removeToken();
    }
  }

  static async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me");

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || "Failed to get current user");
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem("admin_token");
  }
}

export default AuthService;
