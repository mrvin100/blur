import { Score } from "@/types/party.types"
import { AddScoreRequestData } from "@/types/score.types"
import axios from "axios"

export const addScoreForUser = async (data: AddScoreRequestData) => {
  try {
    await axios.post<Score>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/scores/add`, data)
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}


export const getScoreByRaceId = async (raceId: string): Promise<Score[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/scores/get-by-race-id?raceId=${raceId}`)
    return response.data.data
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}