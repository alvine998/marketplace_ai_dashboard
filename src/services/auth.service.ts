import api from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", payload);

    // Store token and user in sessionStorage
    if (response.data.token) {
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  },

  logout(): void {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },

  getToken(): string | null {
    return sessionStorage.getItem("token");
  },

  getUser(): User | null {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp;

      if (!exp) return false; // No expiration claim, assume valid

      // Check if token is expired (exp is in seconds, Date.now() is in ms)
      return Date.now() >= exp * 1000;
    } catch {
      // If token can't be decoded, consider it expired
      return true;
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    if (this.isTokenExpired()) {
      this.logout(); // Clear expired session
      return false;
    }

    return true;
  },
};

export default authService;
