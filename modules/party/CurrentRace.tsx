"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAddParticipant, useCurrentUser, useParty, useRace, useRemoveParticipant, useScoresByRace, useStartRace, useCompleteRace } from "@/hooks"
import Image from "next/image"
import { useEffect } from "react"
import { Play, Square } from "lucide-react"

interface CurrentRaceProps {
  raceId: string | undefined
  partyId: number
}

export function CurrentRace({ raceId, partyId }: CurrentRaceProps) {
  const { data: race, refetch: refetchRace } = useRace(raceId || "0")
  const { data: scores, refetch: refetchScores } = useScoresByRace(raceId || "0")

  const { data: me } = useCurrentUser()
  const { data: party } = useParty(partyId)
  const addParticipant = useAddParticipant()
  const removeParticipant = useRemoveParticipant()
  const startRace = useStartRace()
  const completeRace = useCompleteRace()

  const myId = me?.id
  const hasJoinedRace = !!myId && !!race?.racers?.some((r) => r.id === myId)
  
  // Race status checks
  const isPending = race?.status === "PENDING"
  const isInProgress = race?.status === "IN_PROGRESS"
  const isCompleted = race?.status === "COMPLETED"
  const isCancelled = race?.status === "CANCELLED"
  
  // Any joined racer can start/stop the race
  const canStart = hasJoinedRace && isPending
  const canStop = hasJoinedRace && isInProgress
  // Can only join/leave when race is pending
  const canJoinLeave = isPending

  useEffect(() => {
    if (raceId) {
      fetchData()
    }
  }, [raceId])

  const fetchData = async () => {
    await refetchScores()
    await refetchRace()
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

  const getStatusBadge = () => {
    switch (race?.status) {
      case "PENDING":
        return <Badge variant="secondary">En attente</Badge>
      case "IN_PROGRESS":
        return <Badge variant="default" className="bg-green-500">En cours</Badge>
      case "COMPLETED":
        return <Badge variant="outline">Terminée</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return null
    }
  }

  if (!raceId) {
    return <p>Aucune course sélectionnée</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold">Course #{race?.id} - {race?.createdAt && formatDate(race.createdAt)}</h2>
            {getStatusBadge()}
          </div>
          {race?.createdAt && (
            <p className="text-sm text-muted-foreground">Créée le {formatDate(race.createdAt)}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Join/Leave buttons - only show when race is pending */}
          {canJoinLeave && (
            <>
              {!hasJoinedRace ? (
                <Button
                  size="sm"
                  disabled={!myId || !raceId || addParticipant.isPending}
                  onClick={async () => {
                    if (!myId || !raceId) return
                    await addParticipant.mutateAsync({ raceId, userId: myId })
                    await refetchRace()
                    await refetchScores()
                  }}
                >
                  Rejoindre la course
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!myId || !raceId || removeParticipant.isPending}
                  onClick={async () => {
                    if (!myId || !raceId) return
                    await removeParticipant.mutateAsync({ raceId, userId: myId })
                    await refetchRace()
                    await refetchScores()
                  }}
                >
                  Quitter la course
                </Button>
              )}
            </>
          )}

          {/* Start button - only show when race is pending */}
          {isPending && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  disabled={!canStart || !raceId || startRace.isPending}
                  title={!canStart ? "Rejoignez la course pour pouvoir démarrer" : undefined}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4" />
                  Démarrer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Démarrer la course ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Confirmez que tous les joueurs sont prêts. Cette action ne peut pas être annulée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      if (!raceId) return
                      await startRace.mutateAsync(raceId)
                      await refetchRace()
                    }}
                  >
                    Continuer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Stop button - only show when race is in progress */}
          {isInProgress && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={!canStop || !raceId || completeRace.isPending}
                  title={!canStop ? "Rejoignez la course pour pouvoir l'arrêter" : undefined}
                  className="gap-2"
                >
                  <Square className="h-4 w-4" />
                  Arrêter la course
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Arrêter la course ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action terminera la course et enregistrera les scores. Assurez-vous que tous les scores ont été soumis.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      if (!raceId) return
                      await completeRace.mutateAsync(raceId)
                      await refetchRace()
                      await refetchScores()
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Arrêter et enregistrer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Show status message for completed/cancelled races */}
          {(isCompleted || isCancelled) && (
            <p className="text-sm text-muted-foreground self-center">
              {isCompleted ? "Course terminée" : "Course annulée"}
            </p>
          )}
        </div>
      </div>

      {race?.raceParameters && race.raceParameters.length > 0 && (
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Paramètres de la course</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {race?.raceParameters?.map((param) => (
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
        {race?.racers && race.racers.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {race?.racers
                  ?.map((racer) => ({
                    racer,
                    score: scores?.find((s) => s.user?.id === racer.id)
                  }))
                  .sort((a, b) => {
                    // Sort by rank (ascending: 1st, 2nd, 3rd...)
                    // Put racers without scores at the end
                    if (!a.score && !b.score) return 0
                    if (!a.score) return 1
                    if (!b.score) return -1
                    return a.score.value - b.score.value
                  })
                  .map(({ racer, score }) => (
                    <TableRow key={racer.id.toString()}>
                      <TableCell className="font-medium">{racer.userName}</TableCell>
                      <TableCell>{score ? score.value : "-"}</TableCell>
                    </TableRow>
                  ))}
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

