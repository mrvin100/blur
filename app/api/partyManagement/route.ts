import { Party } from "@/types/party.types";
import axios from "axios";

export const getAllParties = async (): Promise<Party[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/parties`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const getPartyById = async (id: bigint): Promise<Party>=> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/parties/${id}`
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
