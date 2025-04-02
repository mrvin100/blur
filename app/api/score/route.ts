import { Score } from "@/types/party.types"
import { AddScoreRequestData } from "@/types/score.types"
import axios from "axios"

export const addScoreForUser = async (data: AddScoreRequestData) => {
  try {
    await axios.post<Score>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/scores/add`, { data })
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}