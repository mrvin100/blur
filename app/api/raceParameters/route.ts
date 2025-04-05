import { RaceParameter } from "@/types/raceParameters.types";
import axios from "axios"

export const getAllRaceParameters = async (): Promise<RaceParameter[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/raceParameters`);
    return response.data.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}