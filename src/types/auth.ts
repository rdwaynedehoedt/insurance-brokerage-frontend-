export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
} 