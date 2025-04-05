"use client"

import { useQuery } from '@tanstack/react-query';
import { Race } from '@/types/party.types';
import { getAllRaces, getRaceById, getRacesByPartyId } from '@/app/services/raceService';

export function useRaces() {
  const getRaces = useQuery<Race[]>({
    queryKey: ['races'],
    queryFn: getAllRaces
  });

  const useRaceById = (id: string) => 
    useQuery<Race>({
      queryKey: ['race', id],
      queryFn: () => getRaceById(id),
      enabled: !!id
    });

  const useRacesByPartyId = (partyId: string) =>
    useQuery<Race[]>({
      queryKey: ['races', 'party', partyId],
      queryFn: () => getRacesByPartyId(partyId),
      enabled: !!partyId
    });

  return {
    getRaces,
    useRaceById,
    useRacesByPartyId
  };
}