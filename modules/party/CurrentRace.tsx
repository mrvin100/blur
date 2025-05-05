"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRace } from "@/hooks/useRace"
import { useScore } from "@/hooks/useScore"
import Image from "next/image"
import { useEffect } from "react"

interface CurrentRaceProps {
  raceId: string | undefined
}

export function CurrentRace({ raceId }: CurrentRaceProps) {
  const { fetchRaceById } = useRace(raceId)
  const { fetchScoreByRaceId } = useScore(raceId)


  useEffect(() => {
    fetchData()
  }, [fetchScoreByRaceId.data])


  const fetchData = async () => {
    await fetchScoreByRaceId.refetch()
    await fetchRaceById.refetch()
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

  if (!raceId) {
    return <p>Aucune course sélectionnée</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Course du {fetchRaceById.data && formatDate(fetchRaceById.data.createdAt)}</h2>
          {fetchRaceById.data && (
            <p className="text-sm text-muted-foreground">Créée le {formatDate(fetchRaceById.data.createdAt)}</p>
          )}
        </div>
      </div>

      {fetchRaceById.data && fetchRaceById.data.raceParameters && fetchRaceById.data.raceParameters.length > 0 && (
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Paramètres de la course</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fetchRaceById.data && fetchRaceById.data.raceParameters.map((param) => (

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
        {fetchRaceById.data && fetchRaceById.data.racers && fetchRaceById.data.racers.length > 0 ? (
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

