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

// Validate that all required environment variables are present
const validateEnvVariables = () => {
  const required = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_AUTH_API_LOGIN',
    'NEXT_PUBLIC_AUTH_API_LOGOUT',
    'NEXT_PUBLIC_AUTH_API_SESSION',
  ];

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// Initialize and validate API configuration
validateEnvVariables();

export const API_CONFIG: APIConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!,
  endpoints: {
    auth: {
      login: process.env.NEXT_PUBLIC_AUTH_API_LOGIN!,
      logout: process.env.NEXT_PUBLIC_AUTH_API_LOGOUT!,
      session: process.env.NEXT_PUBLIC_AUTH_API_SESSION!,
    },
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

export default API_CONFIG; 