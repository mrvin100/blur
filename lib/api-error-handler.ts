/**
 * Centralized API Error Handler
 * Handles common errors globally with toast notifications
 */

import { toast } from 'sonner';
import { HTTPError } from 'ky';

export interface ApiError {
  status: number;
  message: string;
  error?: string;
  path?: string;
}

/**
 * Standard error messages by HTTP status code
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Requête invalide. Veuillez vérifier vos données.',
  401: 'Session expirée. Veuillez vous reconnecter.',
  403: 'Vous n\'avez pas les permissions nécessaires.',
  404: 'Ressource non trouvée.',
  409: 'Conflit de données. Cette ressource existe déjà.',
  422: 'Données invalides. Veuillez vérifier le formulaire.',
  429: 'Trop de requêtes. Veuillez patienter.',
  500: 'Erreur serveur. Veuillez réessayer plus tard.',
  502: 'Service indisponible. Veuillez réessayer.',
  503: 'Service en maintenance. Veuillez réessayer plus tard.',
};

/**
 * Parse error response from API
 */
export async function parseApiError(error: unknown): Promise<ApiError> {
  if (error instanceof HTTPError) {
    const status = error.response.status;
    
    try {
      const body = await error.response.json() as { message?: string; error?: string; path?: string };
      return {
        status,
        message: body.message || ERROR_MESSAGES[status] || 'Une erreur est survenue.',
        error: body.error,
        path: body.path,
      };
    } catch {
      return {
        status,
        message: ERROR_MESSAGES[status] || 'Une erreur est survenue.',
      };
    }
  }

  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message || 'Une erreur réseau est survenue.',
    };
  }

  return {
    status: 0,
    message: 'Une erreur inattendue est survenue.',
  };
}

/**
 * Handle API error with toast notification
 * Returns the parsed error for custom handling if needed
 */
export async function handleApiError(
  error: unknown,
  options?: {
    silent?: boolean; // Don't show toast
    customMessage?: string; // Override error message
    onUnauthorized?: () => void; // Custom 401 handler
    onForbidden?: () => void; // Custom 403 handler
  }
): Promise<ApiError> {
  const apiError = await parseApiError(error);
  
  // Handle specific status codes
  if (apiError.status === 401) {
    options?.onUnauthorized?.();
    // Don't show toast for 401 - redirect is handled by API client
    return apiError;
  }

  if (apiError.status === 403 && options?.onForbidden) {
    options.onForbidden();
  }

  // Show toast notification unless silent
  if (!options?.silent) {
    const message = options?.customMessage || apiError.message;
    
    // Show only the backend (or custom) message to avoid duplicated/misleading toasts
    toast.error(message);

  }

  return apiError;
}

/**
 * Create a mutation error handler for React Query
 * Provides consistent error handling across all mutations
 */
export function createMutationErrorHandler(options?: {
  silent?: boolean;
  customMessage?: string;
}) {
  return async (error: Error) => {
    await handleApiError(error, options);
  };
}

/**
 * Type guard to check if error is an API error
 */
export function isApiError(error: unknown): error is HTTPError {
  return error instanceof HTTPError;
}

/**
 * Get user-friendly error message from any error
 */
export async function getErrorMessage(error: unknown): Promise<string> {
  const apiError = await parseApiError(error);
  return apiError.message;
}
