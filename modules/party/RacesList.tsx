"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Race } from "@/types/party.types"

interface RacesListProps {
  races: Race[]
  onRaceSelect: (raceId: string) => void
}

export function RacesList({ races, onRaceSelect }: RacesListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      {races.map((race) => (
        <Card key={race.id.toString()} className="hover:bg-muted/30 transition-colors border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-medium text-lg">Course #{race.id.toString()}</h3>
                {race.party?.datePlayed && (
                  <p className="text-sm text-muted-foreground">{formatDate(race.party.datePlayed)}</p>
                )}
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    {race.racers && race.racers.length > 0
                      ? `${race.racers.length} participant${race.racers.length > 1 ? "s" : ""}`
                      : "Aucun participant"}
                  </p>
                  {race.raceParameters && race.raceParameters.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Paramètres: {race.raceParameters.map((p) => p.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => onRaceSelect(race.id.toString())}>
                Voir détails
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {races.length === 0 && (
        <div className="text-center py-12 border rounded-md bg-muted/10">
          <p className="text-muted-foreground">Aucune course disponible</p>
        </div>
      )}
    </div>
  )
}

