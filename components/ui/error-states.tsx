"use client";

import { AlertTriangle, ShieldX, ServerCrash, WifiOff, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showRetryButton?: boolean;
}

/**
 * Composant d'erreur pour les problèmes d'autorisation (403)
 */
export function PermissionDenied({
  title = "Accès refusé",
  description = "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.",
  onRetry,
  showHomeButton = true,
  showRetryButton = false,
}: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-md text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
          <ShieldX className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center gap-3">
        {showRetryButton && onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        )}
        {showHomeButton && (
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Retour au Dashboard
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * Composant d'erreur pour les ressources non trouvées (404)
 */
export function NotFound({
  title = "Ressource introuvable",
  description = "La ressource que vous cherchez n'existe pas ou a été supprimée.",
  showHomeButton = true,
}: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-md text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <AlertTriangle className="h-8 w-8 text-gray-600 dark:text-gray-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {showHomeButton && (
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Retour au Dashboard
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * Composant d'erreur pour les erreurs serveur (500)
 */
export function ServerError({
  title = "Erreur serveur",
  description = "Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
  onRetry,
  showHomeButton = true,
  showRetryButton = true,
}: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-md text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <ServerCrash className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center gap-3">
        {showRetryButton && onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        )}
        {showHomeButton && (
          <Button asChild variant={showRetryButton ? "ghost" : "default"}>
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Retour au Dashboard
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * Composant d'erreur pour les problèmes de connexion réseau
 */
export function NetworkError({
  title = "Problème de connexion",
  description = "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
  onRetry,
  showRetryButton = true,
}: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-md text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
          <WifiOff className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {showRetryButton && onRetry && (
        <CardFooter className="flex justify-center">
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * Composant d'erreur générique qui choisit le bon affichage selon le code d'erreur
 */
export function ApiErrorState({
  error,
  onRetry,
  showHomeButton = true,
}: {
  error: Error | unknown;
  onRetry?: () => void;
  showHomeButton?: boolean;
}) {
  // Extraire le code de statut de l'erreur
  const getStatusCode = (err: unknown): number | null => {
    if (err && typeof err === 'object') {
      // HTTPError from ky
      if ('response' in err && err.response && typeof err.response === 'object' && 'status' in err.response) {
        return err.response.status as number;
      }
      // Error message avec status code
      if ('message' in err && typeof err.message === 'string') {
        const match = err.message.match(/status code (\d+)/);
        if (match) return parseInt(match[1], 10);
      }
    }
    return null;
  };

  const statusCode = getStatusCode(error);

  switch (statusCode) {
    case 401:
      return (
        <PermissionDenied
          title="Session expirée"
          description="Votre session a expiré. Veuillez vous reconnecter."
          showHomeButton={false}
          showRetryButton={false}
        />
      );
    case 403:
      return (
        <PermissionDenied
          title="Accès refusé"
          description="Vous n'avez pas les permissions nécessaires pour accéder à cette ressource. Contactez un administrateur si vous pensez que c'est une erreur."
          onRetry={onRetry}
          showHomeButton={showHomeButton}
          showRetryButton={!!onRetry}
        />
      );
    case 404:
      return (
        <NotFound
          showHomeButton={showHomeButton}
        />
      );
    case 500:
    case 502:
    case 503:
      return (
        <ServerError
          onRetry={onRetry}
          showHomeButton={showHomeButton}
        />
      );
    default:
      // Vérifier si c'est une erreur réseau
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return (
          <NetworkError
            onRetry={onRetry}
          />
        );
      }
      // Erreur générique
      return (
        <ServerError
          title="Une erreur s'est produite"
          description={error instanceof Error ? error.message : "Une erreur inattendue s'est produite."}
          onRetry={onRetry}
          showHomeButton={showHomeButton}
        />
      );
  }
}
