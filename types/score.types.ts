/**
 * Score Types
 */

export interface Score {
  id: number;
  value: number;
  rank: number;
  user?: {
    id: number;
    userName: string;
  };
  race?: {
    id: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// DTOs
export interface CreateScoreDto {
  value: number;
  raceId: number;
  userId: number;
}

export interface UpdateScoreDto {
  value?: number;
}

// Legacy alias
export type AddScoreRequestData = CreateScoreDto;