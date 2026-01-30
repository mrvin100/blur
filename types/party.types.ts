/**
 * Party Types
 */

import { Car, CarAttribution } from "./car.types";
import { Map } from "./map.types";

export interface PartyUserMini {
  id: number;
  userName: string;
}

export interface Party {
  id: number;
  name?: string;
  datePlayed: string;
  createdAt?: string;
  updatedAt?: string;
  creator?: PartyUserMini;
  managers?: PartyUserMini[];
  racesPlayed?: Race[];
  participants?: Participant[];
}

export interface Race {
  id: number;
  party?: PartyRace;
  scores?: Score[];
  racers?: Racer[];
  raceParameters?: RaceParameter[];
  car?: Car;
  card?: Map;
  attributions?: CarAttribution[];
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  attributionType?: 'PER_USER' | 'ALL_USERS';
}

export interface Score {
  id: number;
  value: number;
  user?: Racer;
  race?: { id: number };
  createdAt?: string;
}

export interface PartyRace {
  id: number;
  datePlayed: string;
}

export interface Racer {
  id: number;
  userName: string;
  email?: string;
}

export interface Participant {
  id: number;
  userName: string;
  email?: string;
}

export interface RaceParameter {
  id: number;
  name: string;
  isActive: boolean;
  downloadUrl?: string;
  description?: string;
}

// DTOs
export interface CreatePartyDto {
  name?: string;
  datePlayed?: string;
  participantIds?: number[];
}

export interface UpdatePartyDto {
  name?: string;
  datePlayed?: string;
}

export interface CreateRaceDto {
  partyId: number;
  // cardId is not configurable yet in backend (random card is selected)
  attributionType?: 'PER_USER' | 'ALL_USERS';
  // race parameters are auto-selected in backend during creation
}

export interface UpdateRaceDto {
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  cardId?: number;
}

// Legacy aliases
export type RaceParameters = RaceParameter;