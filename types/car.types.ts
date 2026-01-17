/**
 * Car Types
 */

export interface Car {
  id: number;
  name: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarAttribution {
  id: number;
  car: {
    id: number;
    name: string;
    imageUrl: string;
  };
  user: {
    id: number;
    userName: string;
  };
  notes?: string;
  createdAt?: string;
}