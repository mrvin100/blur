/**
 * Map/Card Types
 */

export interface Map {
  id: number;
  location: string;
  track: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// Alias for clarity
export type Card = Map;