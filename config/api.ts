import { APIConfig } from '@/types';

export const API_CONFIG: APIConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      session: '/auth/session',
    },
  },
};

// Get environment-specific configuration
const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? (isDevelopment ? 'http://localhost:3000' : ''),
    auth: {
      login: process.env.NEXT_PUBLIC_AUTH_API_LOGIN ?? '/auth/login',
      logout: process.env.NEXT_PUBLIC_AUTH_API_LOGOUT ?? '/auth/logout',
      session: process.env.NEXT_PUBLIC_AUTH_API_SESSION ?? '/auth/session',
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

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

export default API_CONFIG; 