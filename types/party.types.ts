export interface Party {
  id: string,
  datePlayed: string,
  racesPlayed: Race[],
  }
  
  export interface Race {
      id: bigint,
      party: PartyRace,
      scores: Score[],
      racers: Racer[],
      raceParameters: RaceParameters[]
  }
  
  export interface Score {
      id: bigint,
      value: number,
      user: Racer
  }
  
  export interface PartyRace {
      id: bigint,
      datePlayed: string
  }
  
  export interface Racer {
      id: bigint,
      userName: string
  }
  
  export interface RaceParameters {
      id: bigint,
      name: string,
      isActive: true,
      downloadUrl: string
  }