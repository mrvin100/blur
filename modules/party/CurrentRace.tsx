"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import { useAddParticipant, useCurrentUser, useJoinParty, useParty, useRace, useRemoveParticipant, useScoresByRace, useStartRace } from "@/hooks"
import Image from "next/image"
import { useEffect } from "react"

interface CurrentRaceProps {
  raceId: string | undefined
  partyId: number
}

export function CurrentRace({ raceId, partyId }: CurrentRaceProps) {
  const { data: race, refetch: refetchRace } = useRace(raceId || "0")
  const { data: scores, refetch: refetchScores } = useScoresByRace(raceId || "0")

  const { data: me } = useCurrentUser()
  const { data: party } = useParty(partyId)
  const joinParty = useJoinParty()
  const addParticipant = useAddParticipant()
  const removeParticipant = useRemoveParticipant()
  const startRace = useStartRace()

  const myId = me?.id
  const hasJoinedRace = !!myId && !!race?.racers?.some((r) => r.id === myId)
  const isCreator = !!myId && party?.creator?.id === myId
  const isManager = !!myId && (party?.managers ?? []).some((m) => m.id === myId)
  const canStart = isCreator || isManager

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

  if (!raceId) {
    return <p>Aucune course sélectionnée</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h2 className="text-xl font-semibold">Course du {race?.createdAt && formatDate(race.createdAt)}</h2>
          {race?.createdAt && (
            <p className="text-sm text-muted-foreground">Créée le {formatDate(race.createdAt)}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!myId || joinParty.isPending}
            onClick={async () => {
              if (!myId) return
              await joinParty.mutateAsync(partyId)
            }}
            title={!myId ? 'Chargement utilisateur...' : undefined}
          >
            Rejoindre la partie
          </Button>

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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                disabled={!canStart || !raceId || startRace.isPending}
                title={!canStart ? "Seul l'hôte / party manager peut démarrer" : undefined}
              >
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
                {race?.racers?.map((racer) => {
                  const score = scores?.find((s) => s.user?.id === racer.id)
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

