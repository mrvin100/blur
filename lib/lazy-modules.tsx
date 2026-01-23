"use client";

import dynamic from "next/dynamic";
import {
  PageLoader,
  PartyDashboardSkeleton,
  TableSkeleton,
} from "@/components/ui/page-loader";

/**
 * Lazy Loaded Modules
 * Utilise Next.js dynamic imports pour le code splitting
 * Améliore les performances en ne chargeant que ce qui est nécessaire
 */

// ============================================
// Party Modules
// ============================================

export const LazyPartyDashboard = dynamic(
  () => import("@/modules/party/PartyDashboard").then((mod) => ({ default: mod.PartyDashboard })),
  {
    loading: () => <PartyDashboardSkeleton />,
    ssr: false,
  }
);

export const LazyNewParty = dynamic(
  () => import("@/modules/party/NewParty").then((mod) => ({ default: mod.NewPartyPage })),
  {
    loading: () => <PageLoader message="Chargement du formulaire..." />,
    ssr: false,
  }
);

export const LazyRaceManagement = dynamic(
  () => import("@/modules/party/RaceManagement").then((mod) => ({ default: mod.RaceManagement })),
  {
    loading: () => <PageLoader message="Chargement des courses..." />,
    ssr: false,
  }
);

export const LazyScoreForm = dynamic(
  () => import("@/modules/party/ScoreForm").then((mod) => ({ default: mod.ScoreForm })),
  {
    loading: () => <PageLoader message="Chargement du formulaire de score..." />,
    ssr: false,
  }
);

export const LazyRacesList = dynamic(
  () => import("@/modules/party/RacesList").then((mod) => ({ default: mod.RacesList })),
  {
    loading: () => <TableSkeleton rows={4} />,
    ssr: false,
  }
);

export const LazyCarAttributions = dynamic(
  () => import("@/modules/party/CarAttributions").then((mod) => ({ default: mod.CarAttributions })),
  {
    loading: () => <PageLoader message="Chargement des attributions..." />,
    ssr: false,
  }
);

// ============================================
// User Modules
// ============================================

export const LazyUsers = dynamic(
  () => import("@/modules/users/Users").then((mod) => ({ default: mod.Users })),
  {
    loading: () => <TableSkeleton rows={8} />,
    ssr: false,
  }
);

export const LazyUserDetailsModal = dynamic(
  () => import("@/modules/users/UserDetailsModal"),
  {
    loading: () => <PageLoader message="Chargement des détails..." />,
    ssr: false,
  }
);

// ============================================
// History Module
// ============================================

export const LazyHistory = dynamic(
  () => import("@/modules/history/History").then((mod) => ({ default: mod.History })),
  {
    loading: () => <TableSkeleton rows={6} />,
    ssr: false,
  }
);

// ============================================
// Home Modules
// ============================================

export const LazyHeroSection = dynamic(
  () => import("@/modules/home/HeroSection").then((mod) => ({ default: mod.HeroSection })),
  {
    loading: () => <PageLoader message="Chargement..." />,
    ssr: true, // SSR pour SEO
  }
);

export const LazyStatsSection = dynamic(
  () => import("@/modules/home/StatsSection").then((mod) => ({ default: mod.StatsSection })),
  {
    loading: () => <PageLoader message="Chargement des statistiques..." />,
    ssr: true,
  }
);

// ============================================
// Modal Components (lazy loaded on demand)
// ============================================

export const LazyAddParticipantsModal = dynamic(
  () => import("@/modules/party/AddParticipantsModal").then((mod) => ({ default: mod.AddParticipantsModal })),
  {
    loading: () => <PageLoader message="Chargement..." />,
    ssr: false,
  }
);

export const LazyRaceDetailsModal = dynamic(
  () => import("@/modules/party/RaceDetailsModal").then((mod) => ({ default: mod.RaceDetailsModal })),
  {
    loading: () => <PageLoader message="Chargement des détails..." />,
    ssr: false,
  }
);
