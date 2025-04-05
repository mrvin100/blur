import { Race } from "@/types/party.types";

export async function getAllRaces(): Promise<Race[]> {
  const response = await fetch('/api/raceManagement');
  if (!response.ok) {
    throw new Error('Failed to fetch races');
  }
  const data = await response.json();
  return data.data;
}

export async function getRaceById(id: string): Promise<Race> {
  const response = await fetch(`/api/raceManagement?raceId=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch race');
  }
  const data = await response.json();
  return data.data;
}

export async function getRacesByPartyId(id: string): Promise<Race[]> {
  const response = await fetch(`/api/raceManagement?partyId=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch races for party');
  }
  const data = await response.json();
  return data.data;
} 