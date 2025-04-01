import { Party } from "@/types/party.types";
import axios from "axios";

export const createPartyApi = async () => {
  try {
    const response = await axios.post<Party>(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/parties`);
    return response.data;
  } catch (error) {
    console.error(error);
  }

}