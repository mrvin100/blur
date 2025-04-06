import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRace } from "@/hooks/useRace"
import { useScore } from "@/hooks/useScore"
import { Race } from "@/types/party.types"
import Image from "next/image"

interface CurrentRaceProps {
  race: Race
}

export function CurrentRace({ race }: CurrentRaceProps) {
  const { fetchRaceById } = useRace(race.id)
  const { fetchScoreByRaceId } = useScore(race.id)
  if (!race) {
    return <p>Aucune course sélectionnée</p>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Course #{race.id.toString()}</h2>
          {race.party.datePlayed && (
            <p className="text-sm text-muted-foreground">Créée le {formatDate(race.createdAt)}</p>
          )}
        </div>
      </div>

      {race.raceParameters && race.raceParameters.length > 0 && (
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Paramètres de la course</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {race.raceParameters.map((param) => (

                param.isActive && <div key={param.id.toString()} className="flex flex-col items-center">
                  <div className="relative h-16 w-16 mb-2 shadow-sm rounded-md overflow-hidden">
                    <Image
                      src={param.downloadUrl || "/placeholder.svg"}
                      alt={param.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{param.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="font-medium mb-3">Participants</h3>
        {fetchRaceById.data && race.racers && fetchRaceById.data.racers.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchScoreByRaceId.data && fetchRaceById.data.racers.map((racer) => {
                  const score = fetchScoreByRaceId.data.find((s) => s.user.id === racer.id)
                  return (
                    <TableRow key={racer.id.toString()}>
                      <TableCell className="font-medium">{racer.userName}</TableCell>
                      <TableCell>{score ? score.value : "-"}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md bg-muted/10">
            <p className="text-muted-foreground">Aucun participant</p>
          </div>
        )}
      </div>
    </div>
  )
}

