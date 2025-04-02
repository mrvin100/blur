import { Users } from "@/types/user.types";
import axios from "axios"

export const getAllUsers = async (): Promise<Users[]> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`)
    const data = response.data.data
    return data;
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}