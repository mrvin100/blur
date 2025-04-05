import { Car, CarAttribution } from "@/types/car.types";
import axios from "axios";

export const getAllCars = async (): Promise<Car[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars`)
    return response.data.data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
export const getCarsGlobalAttribution = async (): Promise<Car> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cars/global-attribution`)
    return response.data.data;
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

export const getCarsIndividualAttribution = async (data: string[]): Promise<CarAttribution[]> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cars/individual-attribution`, data)
    return response.data.data;
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}