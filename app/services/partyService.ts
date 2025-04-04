import { Party } from "@/types/party.types";

export async function getAllParties(): Promise<Party[]> {
  const response = await fetch('/api/partyManagement');
  if (!response.ok) {
    throw new Error('Failed to fetch parties');
  }
  const data = await response.json();
  return data.data;
}

export async function getPartyById(id: number): Promise<Party> {
  const response = await fetch(`/api/partyManagement?partyId=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch party');
  }
  const data = await response.json();
  return data.data;
} 