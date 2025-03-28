import { Race } from "@/types/party.types";
import axios from "axios";


export const getAllRaces = async (): Promise<Race[]> => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/races`
          );
          const data = response.data;
          return data;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}

export const getRaceById = async (id: bigint): Promise<Race> => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/races/get-by-id?raceId=${id}`
        );
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}

export const getRacesByPartyId = async (id: bigint): Promise<Race[]> => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/races/get-by-party-id?partyId=${id}`
        );
        const data = response.data;
        return data;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
} 