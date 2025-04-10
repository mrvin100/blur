import { Map } from "@/types/map.types";

export async function getAllMaps(): Promise<Map[]> {
  const response = await fetch('/api/map');
  if (!response.ok) {
    throw new Error('Failed to fetch maps');
  }
  const data = await response.json();
  return data.data;
}

export async function getRandomMap(raceId: string): Promise<Map> {
  const response = await fetch(`/api/map/random?raceId=${raceId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch random map');
  }
  const data = await response.json();
  return data.data;
}