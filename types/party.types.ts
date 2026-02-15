/**
 * Party Types
 */

import { Car, CarAttribution } from "./car.types";
import { Map } from "./map.types";

// Party role enum matching backend
export type PartyRole = 'HOST' | 'CO_HOST' | 'PARTICIPANT';

export interface PartyUserMini {
  id: number;
  userName: string;
}

export interface PartyMemberInfo {
  id: number;
  partyId: number;
  userId: number;
  userName: string;
  role: PartyRole;
  invitedById?: number;
  invitedByName?: string;
  joinedAt?: string;
}

export interface Party {
  id: number;
  name?: string;
  datePlayed: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // New role-based fields
  host?: PartyUserMini;
  coHosts?: PartyUserMini[];
  participants?: PartyUserMini[];
  members?: PartyMemberInfo[];
  
  // Legacy fields for backward compatibility
  creator?: PartyUserMini;
  managers?: PartyUserMini[];
  racesPlayed?: Race[];
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

// Party member management DTOs
export interface AddPartyMemberDto {
  userId: number;
  role?: PartyRole;
}

export interface UpdatePartyMemberRoleDto {
  role: PartyRole;
}

export interface CanManageResponse {
  canManage: boolean;
}

export interface MyRoleResponse {
  role: PartyRole | 'NOT_MEMBER';
}

// Legacy aliases
export type RaceParameters = RaceParameter;
export type Participant = PartyUserMini;