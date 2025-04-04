
export interface Party {
id: number,
datePlayed: string,
racesPlayed: Race[],
}

export interface Race {
    id: number,
    party: PartyRace,
    scores: Score[],
    racers: Racer[],
    raceParameters: RaceParameters[]
}

export interface Score {
    id: number,
    value: number,
    user: Racer
}

export interface PartyRace {
    id: number,
    datePlayed: string
}

export interface Racer {
    id: number,
    userName: string
}

export interface RaceParameters {
    id: number,
    name: string,
    isActive: true,
    downloadUrl: string
}


