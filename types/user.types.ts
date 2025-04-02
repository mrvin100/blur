import { Race } from "./party.types"

export interface Users {
  id: bigint,
  userName: string,
  permissions: Permission[],
  races: Race[]
}

export interface Permission {
  id: string,
  name: string
}