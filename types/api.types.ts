export interface AuthEndpoints {
  login: string;
  logout: string;
  session: string;
}

export interface APIEndpoints {
  auth: AuthEndpoints;
}

export interface APIConfig {
  baseURL: string;
  endpoints: APIEndpoints;
} 