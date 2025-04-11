"use client"

import { useParties } from "@/hooks/useParties"
import { useRaces } from "@/hooks/useRaces"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Users, Flag, User, Settings, Medal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Party, Race, Racer } from "@/types/party.types"

export function History() {
  const { getParties } = useParties()

  if (getParties.isLoading) {
    return <HistorySkeleton />
  }

  if (getParties.isError) {
    return <div className="text-red-500">Error loading parties: {getParties.error?.toString()}</div>
  }

  return (
    <Card className="w-full max-w-3xl md:mx-auto md:my-5">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Calendar className="h-5 w-5" />
          Race History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {getParties.data?.map((party) => (
            <PartyItem key={party.id.toString()} party={party} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

function PartyItem({ party }: Readonly<{ party: Party }>) {
  const { useRacesByPartyId } = useRaces()
  const { data: races, isLoading, isError } = useRacesByPartyId(party.id)

  // Calculate cumulative scores and determine party winner
  const { partyWinner, playerScores } = calculatePartyScores(races || [])

  return (
    <AccordionItem value={`party-${party.id}`}>
      <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Party {party.id.toString()}</span>
          <span className="text-xs text-muted-foreground ml-2">{new Date(party.datePlayed).toLocaleDateString()}</span>
          <Badge variant="outline" className="ml-auto">
            {races?.length ?? party.racesPlayed?.length ?? 0} races
          </Badge>
          {partyWinner && (
            <Badge variant="secondary" className="ml-2">
              <Trophy className="h-3 w-3 mr-1 text-amber-500" />
              {partyWinner.racer.userName}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        {isLoading ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="text-red-500 py-2">Error loading races</div>
        ) : races?.length === 0 ? (
          <div className="text-muted-foreground py-2">No races found for this party</div>
        ) : (
          <div className="space-y-6">
            {/* Player Rankings - FIRST */}
            {playerScores.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-lg">Player Rankings</span>
                </div>
                <div className="space-y-2">
                  {playerScores.map((player, index) => (
                    <div
                      key={player.racer.id.toString()}
                      className={`flex items-center justify-between p-3 rounded ${
                        index === 0 ? "bg-amber-900 border border-amber-200" : "bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">{index + 1}.</span>
                        <span className={index === 0 ? "font-medium" : ""}>{player.racer.userName}</span>
                        {index === 0 && <Medal className="h-4 w-4 text-amber-200 ml-1" />}
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"}>{player.totalScore} pts</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Party Winner Section - SECOND */}
            {partyWinner && (
              <div className="border p-4 rounded-md border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="font-medium text-lg">Party Champion</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium text-xl">{partyWinner.racer.userName}</div>
                  <div className="text-sm">
                    Total Score: <span className="font-medium">{partyWinner.totalScore} points</span> in{" "}
                    <span className="font-medium">{partyWinner.raceCount} races</span>
                  </div>
                </div>
              </div>
            )}

            {/* Races - THIRD */}
            <div>
              <h3 className="font-medium text-lg mb-3">Races</h3>
              <Accordion type="single" collapsible className="w-full">
                {races?.map((race) => (
                  <RaceItem key={race.id.toString()} race={race} />
                ))}
              </Accordion>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

function RaceItem({ race }: Readonly<{ race: Race }>) {
  // Find the winner (racer with highest score)
  const getWinner = (): { racer: Racer; score: number } | null => {
    if (!race.scores || race.scores.length === 0) return null

    let highestScore = Number.NEGATIVE_INFINITY
    let winningRacer: Racer | null = null

    race.scores.forEach((score) => {
      if (score.value > highestScore) {
        highestScore = score.value
        winningRacer = score.user
      }
    })

    return winningRacer ? { racer: winningRacer, score: highestScore } : null
  }

  const winner = getWinner()
  const parameters = race.raceParameters && race.raceParameters.length > 0 ? race.raceParameters[0] : null

  return (
    <AccordionItem value={`race-${race.id}`}>
      <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-muted-foreground" />
          <span>{parameters?.name || `Race ${race.id.toString()}`}</span>
          {race.party?.datePlayed && (
            <span className="text-xs text-muted-foreground">
              {new Date(race.party.datePlayed).toLocaleDateString()}
            </span>
          )}
          <Badge variant="outline" className="ml-auto">
            {race.racers?.length || 0} racers
          </Badge>
          {winner && (
            <Badge variant="secondary" className="ml-2">
              <Trophy className="h-3 w-3 mr-1 text-amber-500" />
              {winner.racer.userName}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4">
        <div className="space-y-4">
          {/* Winner section */}
          <div className="bg-muted/50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-medium">Winner</span>
            </div>

            {winner ? (
              <div className="flex flex-col gap-1">
                <div className="font-medium">{winner.racer.userName}</div>
                <div className="text-sm text-muted-foreground">Score: {winner.score}</div>
              </div>
            ) : (
              <div className="text-muted-foreground">No winner recorded</div>
            )}
          </div>

          {/* Race parameters section */}
          {parameters && (
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Parameters</span>
              </div>
              <div className="text-sm">
                <div>
                  <span className="font-medium">Name:</span> {parameters.name}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {parameters.isActive ? "Active" : "Inactive"}
                </div>
                {parameters.downloadUrl && (
                  <div className="mt-1">
                    <a
                      href={parameters.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download Parameters
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Racers section */}
          {race.racers && race.racers.length > 0 && (
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-green-500" />
                <span className="font-medium">Racers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {race.racers.map((racer) => {
                  const racerScore = race.scores?.find((score) => score.user.id === racer.id)?.value
                  return (
                    <div
                      key={racer.id.toString()}
                      className="flex items-center justify-between p-2 bg-background rounded"
                    >
                      <span>{racer.userName}</span>
                      {racerScore !== undefined && <Badge variant="secondary">{racerScore} pts</Badge>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

// Helper function to calculate party scores and determine the winner
function calculatePartyScores(races: Race[]) {
  if (!races || races.length === 0) {
    return { partyWinner: null, playerScores: [] }
  }

  // Create a map to track cumulative scores for each player
  const playerScoresMap = new Map<string, { racer: Racer; totalScore: number; raceCount: number }>()

  // Process all races and accumulate scores
  races.forEach((race) => {
    if (race.scores && race.scores.length > 0) {
      race.scores.forEach((score) => {
        const racerId = score.user.id.toString()
        const currentPlayerData = playerScoresMap.get(racerId)

        if (currentPlayerData) {
          // Update existing player data
          playerScoresMap.set(racerId, {
            racer: score.user,
            totalScore: currentPlayerData.totalScore + score.value,
            raceCount: currentPlayerData.raceCount + 1,
          })
        } else {
          // Add new player data
          playerScoresMap.set(racerId, {
            racer: score.user,
            totalScore: score.value,
            raceCount: 1,
          })
        }
      })
    }
  })

  // Convert map to array and sort by total score (descending)
  const playerScores = Array.from(playerScoresMap.values()).sort((a, b) => b.totalScore - a.totalScore)

  // The party winner is the player with the highest total score
  const partyWinner = playerScores.length > 0 ? playerScores[0] : null

  return { partyWinner, playerScores }
}

function HistorySkeleton() {
  return (
    <Card className="w-full max-w-3xl md:mx-auto md:my-5">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  )
}
