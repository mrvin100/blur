import { Map } from "@/types/map.types"
import axios from "axios"

export const getAllMaps = async (): Promise<Map[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cards`)
    return response.data.data;
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

export const getRandomMap = async (): Promise<Map> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cards/random`)
    return response.data.data
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}