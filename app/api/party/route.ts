import { Party } from "@/types/party.types";
import axios from "axios";

export const createPartyApi = async () => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/parties`);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
}

export const getPartyById = async (partyId: string): Promise<Party> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/parties/get-party/${partyId}`)
    return response.data.data
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}