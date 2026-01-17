/**
 * Race Parameters Types
 */

export interface RaceParameter {
  id: number;
  name: string;
  isActive: boolean;
  downloadUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// DTOs
export interface CreateRaceParameterDto {
  name: string;
  isActive?: boolean;
  downloadUrl?: string;
  description?: string;
}

export interface UpdateRaceParameterDto {
  name?: string;
  isActive?: boolean;
  downloadUrl?: string;
  description?: string;
}