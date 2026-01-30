/**
 * API Response Schemas with Zod Validation
 * Provides runtime validation and type inference for API responses
 */

import { z } from 'zod';

// ============================================
// Base API Response Schemas
// ============================================

/**
 * Generic API Response wrapper
 */
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
    timestamp: z.string().optional(),
    error: z.string().optional(),
  });

/**
 * Paginated Response wrapper
 */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  });

/**
 * Error Response Schema
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
  timestamp: z.string().optional(),
  path: z.string().optional(),
});

// ============================================
// User Schemas
// ============================================

export const userSchema = z.object({
  id: z.number(),
  userName: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  avatar: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const userResponseSchema = createApiResponseSchema(userSchema);
export const usersResponseSchema = createApiResponseSchema(z.array(userSchema));

export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;

// ============================================
// Car Schemas
// ============================================

export const carSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  speed: z.number().optional(),
  acceleration: z.number().optional(),
  handling: z.number().optional(),
  nitro: z.number().optional(),
});

export const carResponseSchema = createApiResponseSchema(carSchema);
export const carsResponseSchema = createApiResponseSchema(z.array(carSchema));

export type Car = z.infer<typeof carSchema>;
export type CarResponse = z.infer<typeof carResponseSchema>;
export type CarsResponse = z.infer<typeof carsResponseSchema>;

// ============================================
// Map/Card Schemas
// ============================================

export const mapSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string().nullable().optional(),
  difficulty: z.string().optional(),
});

export const mapResponseSchema = createApiResponseSchema(mapSchema);
export const mapsResponseSchema = createApiResponseSchema(z.array(mapSchema));

export type GameMap = z.infer<typeof mapSchema>;
export type MapResponse = z.infer<typeof mapResponseSchema>;
export type MapsResponse = z.infer<typeof mapsResponseSchema>;

// ============================================
// Party Schemas
// ============================================

export const partySchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  date: z.string(),
  status: z.string().optional(),
  isActive: z.boolean().optional(),
  createdBy: userSchema.optional(),
  participants: z.array(userSchema).optional(),
  managers: z.array(userSchema).optional(),
  races: z.array(z.any()).optional(), // Will be refined with raceSchema
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const partyResponseSchema = createApiResponseSchema(partySchema);
export const partiesResponseSchema = createApiResponseSchema(z.array(partySchema));

export type Party = z.infer<typeof partySchema>;
export type PartyResponse = z.infer<typeof partyResponseSchema>;
export type PartiesResponse = z.infer<typeof partiesResponseSchema>;

// ============================================
// Race Parameters Schemas
// ============================================

export const raceParametersSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean().nullable().optional(),
  downloadUrl: z.string().nullable().optional(),
});

export const raceParametersResponseSchema = createApiResponseSchema(raceParametersSchema);
export const raceParametersListResponseSchema = createApiResponseSchema(z.array(raceParametersSchema));

export type RaceParameters = z.infer<typeof raceParametersSchema>;
export type RaceParametersResponse = z.infer<typeof raceParametersResponseSchema>;
export type RaceParametersListResponse = z.infer<typeof raceParametersListResponseSchema>;

// ============================================
// Race Schemas
// ============================================

export const raceStatusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

export const raceSchema = z.object({
  id: z.number(),
  party: z
    .object({
      id: z.number(),
      datePlayed: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  createdAt: z.string().nullable().optional(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional(),
  status: raceStatusSchema.optional(),
  attributionType: z.enum(['PER_USER', 'ALL_USERS']).nullable().optional(),
  racers: z.array(userSchema).optional(),
  raceParameters: z.array(raceParametersSchema).optional(),
  card: mapSchema.nullable().optional(),
  car: carSchema.nullable().optional(),
  attributions: z.array(z.any()).optional(),
  scores: z.array(z.any()).optional(),
});

export const raceResponseSchema = createApiResponseSchema(raceSchema);
export const racesResponseSchema = createApiResponseSchema(z.array(raceSchema));

export type Race = z.infer<typeof raceSchema>;
export type RaceStatus = z.infer<typeof raceStatusSchema>;
export type RaceResponse = z.infer<typeof raceResponseSchema>;
export type RacesResponse = z.infer<typeof racesResponseSchema>;

// ============================================
// Score Schemas
// ============================================

export const scoreSchema = z.object({
  id: z.number(),
  raceId: z.number(),
  userId: z.number(),
  user: userSchema.optional(),
  position: z.number(),
  points: z.number(),
  carId: z.number().optional(),
  car: carSchema.optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const scoreResponseSchema = createApiResponseSchema(scoreSchema);
export const scoresResponseSchema = createApiResponseSchema(z.array(scoreSchema));

export type Score = z.infer<typeof scoreSchema>;
export type ScoreResponse = z.infer<typeof scoreResponseSchema>;
export type ScoresResponse = z.infer<typeof scoresResponseSchema>;

// ============================================
// Input/DTO Schemas
// ============================================

export const createUserSchema = z.object({
  userName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const createPartySchema = z.object({
  name: z.string().optional(),
  date: z.string(),
});

export const createRaceSchema = z.object({
  partyId: z.number(),
  attributionType: z.enum(['PER_USER', 'ALL_USERS']).optional(),
});

export const submitScoreSchema = z.object({
  raceId: z.number(),
  userId: z.number(),
  position: z.number().min(1),
  points: z.number().min(0),
  carId: z.number().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreatePartyInput = z.infer<typeof createPartySchema>;
export type CreateRaceInput = z.infer<typeof createRaceSchema>;
export type SubmitScoreInput = z.infer<typeof submitScoreSchema>;

// ============================================
// Validation Helpers
// ============================================

/**
 * Safely parse API response with Zod schema
 * Returns data if valid, throws if invalid
 */
export function parseApiResponse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('API Response validation failed:', result.error.flatten());
    throw new Error(`Invalid API response: ${result.error.issues.map(i => i.message).join(', ')}`);
  }
  return result.data;
}

/**
 * Safely parse with fallback (doesn't throw)
 * Returns parsed data or null
 */
export function safeParseApiResponse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn('API Response validation warning:', result.error.flatten());
    return null;
  }
  return result.data;
}
