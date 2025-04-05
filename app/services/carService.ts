import { Car, CarAttribution } from "@/types/car.types";

export async function getAllCars(): Promise<Car[]> {
  const response = await fetch('/api/car');
  if (!response.ok) {
    throw new Error('Failed to fetch cars');
  }
  const data = await response.json();
  return data.data;
}

export async function getGlobalCarAttribution(): Promise<Car> {
  const response = await fetch('/api/car/attribution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'global' })
  });
  if (!response.ok) {
    throw new Error('Failed to fetch global car attribution');
  }
  const data = await response.json();
  return data.data;
}

export async function getIndividualCarAttribution(carIds: string[]): Promise<CarAttribution[]> {
  const response = await fetch('/api/car/attribution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'individual', carIds })
  });
  if (!response.ok) {
    throw new Error('Failed to fetch individual car attribution');
  }
  const data = await response.json();
  return data.data;
} 