export interface Party {
  id: string,
  datePlayed: string,
  racesPlayed: Race[],
}

export interface Race {
  id: string,
  party: PartyRace,
  scores: Score[],
  racers: Racer[],
  raceParameters: RaceParameters[],
  createdAt: string
}

export interface Score {
  id: string,
  value: number,
  user: Racer
}

export interface PartyRace {
  id: string,
  datePlayed: string
}

export interface Racer {
  id: string,
  userName: string
}

export interface RaceParameters {
  id: string,
  name: string,
  isActive: true,
  downloadUrl: string
}