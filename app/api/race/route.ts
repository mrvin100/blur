import { Race, Racer } from "@/types/party.types";
import axios from "axios";

export const updateRaceById = async (RaceUpdateRequest: Racer[], raceId: bigint) => {
  try {
    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/races/update-race`, { RaceUpdateRequest }, {
      params: {
        raceId: raceId
      }
    })
  } catch (error) {
    console.error(error);
    return Promise.reject(error)
  }
}

export const getRaceById = async (raceId: bigint) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/races/get-by-id`, {
      params: {
        raceId: raceId
      }
    })
    return response.data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getRaceByPartyId = async (partyId: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/races/get-by-party-id`, {
      params: {
        partyId: partyId
      }
    })
    return response.data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const addRace = async (partyId: string): Promise<Race> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/races/create-race`, {
      params: {
        partyId: partyId
      }
    })
    return response.data.data
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}