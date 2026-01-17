/**
 * Centralized Query Keys Factory
 * Following the factory pattern for TanStack Query keys
 * Provides type-safe, consistent query keys across the application
 */

// Auth Keys
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// User Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...userKeys.details(), id] as const,
};

// Party Keys
export const partyKeys = {
  all: ['parties'] as const,
  lists: () => [...partyKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...partyKeys.lists(), { filters }] as const,
  details: () => [...partyKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...partyKeys.details(), id] as const,
  participants: (partyId: number | string) => [...partyKeys.detail(partyId), 'participants'] as const,
};

// Race Keys
export const raceKeys = {
  all: ['races'] as const,
  lists: () => [...raceKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...raceKeys.lists(), { filters }] as const,
  details: () => [...raceKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...raceKeys.details(), id] as const,
  byParty: (partyId: number | string) => [...raceKeys.all, 'party', partyId] as const,
  current: (partyId: number | string) => [...raceKeys.byParty(partyId), 'current'] as const,
};

// Score Keys
export const scoreKeys = {
  all: ['scores'] as const,
  lists: () => [...scoreKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...scoreKeys.lists(), { filters }] as const,
  details: () => [...scoreKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...scoreKeys.details(), id] as const,
  byRace: (raceId: number | string) => [...scoreKeys.all, 'race', raceId] as const,
  byUser: (userId: number | string) => [...scoreKeys.all, 'user', userId] as const,
};

// Car Keys
export const carKeys = {
  all: ['cars'] as const,
  lists: () => [...carKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...carKeys.lists(), { filters }] as const,
  details: () => [...carKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...carKeys.details(), id] as const,
  attribution: {
    all: () => [...carKeys.all, 'attribution'] as const,
    global: (raceId: number | string) => [...carKeys.attribution.all(), 'global', raceId] as const,
    individual: (raceId: number | string, carIds?: string[]) => 
      [...carKeys.attribution.all(), 'individual', raceId, { carIds }] as const,
  },
};

// Map/Card Keys
export const mapKeys = {
  all: ['maps'] as const,
  lists: () => [...mapKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...mapKeys.lists(), { filters }] as const,
  details: () => [...mapKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...mapKeys.details(), id] as const,
  random: (raceId: number | string) => [...mapKeys.all, 'random', raceId] as const,
};

// Race Parameters Keys
export const raceParametersKeys = {
  all: ['raceParameters'] as const,
  lists: () => [...raceParametersKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...raceParametersKeys.lists(), { filters }] as const,
  active: () => [...raceParametersKeys.all, 'active'] as const,
};

// Export all keys
export const queryKeys = {
  auth: authKeys,
  users: userKeys,
  parties: partyKeys,
  races: raceKeys,
  scores: scoreKeys,
  cars: carKeys,
  maps: mapKeys,
  raceParameters: raceParametersKeys,
};

export default queryKeys;
