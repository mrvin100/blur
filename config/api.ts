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

// Get environment-specific configuration
const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? (isDevelopment ? 'http://localhost:3000' : ''),
    auth: {
      login: process.env.NEXT_PUBLIC_AUTH_API_LOGIN ?? '/api/auth/login',
      logout: process.env.NEXT_PUBLIC_AUTH_API_LOGOUT ?? '/api/auth/logout',
      session: process.env.NEXT_PUBLIC_AUTH_API_SESSION ?? '/api/auth/session',
    }
  };
};

// Validate configuration
const validateConfig = (config: ReturnType<typeof getEnvironmentConfig>) => {
  if (!config.baseURL) {
    throw new Error('API base URL is required in production environment');
  }
};

const config = getEnvironmentConfig();

// Only validate in production
if (process.env.NODE_ENV === 'production') {
  validateConfig(config);
}

export const API_CONFIG: APIConfig = {
  baseURL: config.baseURL,
  endpoints: {
    auth: config.auth,
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

export default API_CONFIG; 