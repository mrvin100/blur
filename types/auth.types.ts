export interface User {
  id: string;
  username: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
} 