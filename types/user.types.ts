import { Race } from "./party.types"

export interface Users {
  id: string,
  userName: string,
  permissions: Permission[],
  races: Race[]
}

export interface Permission {
  id: string,
  name: string
}