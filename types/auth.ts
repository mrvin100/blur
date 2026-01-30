export interface Score {
  id: number;
  value: number;
}

export interface Race {
  id: number;
  scores?: Score[];
}

export interface User {
  id: number;
  userName: string;
  email?: string;
  role?: string;
  permissions?: string[];
  races?: Race[];
}

export interface AuthUser {
  id: string;
  userName: string;
  email?: string;
  role?: string;
  permissions?: string[];
  accessToken?: string;
  refreshToken?: string;
}

export interface CreateUserDto {
  userName: string;
  email?: string;
  password: string;
  role: 'GREAT_ADMIN' | 'RACER';
}
 