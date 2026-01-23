"use client"

import { useParties, useRacesByParty } from "@/hooks"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Users, Flag, User, Settings, Medal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiErrorState } from "@/components/ui/error-states"
import type { Party, Race, Racer } from "@/types/party.types"

export function History() {
  const { data: parties, isLoading, isError, error, refetch } = useParties()

  if (isLoading) {
    return <HistorySkeleton />
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <ApiErrorState 
          error={error} 
          onRetry={() => refetch()} 
          showHomeButton={true}
        />
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          Race History
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2">
          View all past parties and race results
        </p>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6">
        {!parties || parties.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
            <p className="text-base sm:text-lg font-medium">No race history yet</p>
            <p className="text-xs sm:text-sm mt-1">Create your first party to start racing!</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {parties.map((party) => (
              <PartyItem key={party.id.toString()} party={party} />
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}

function PartyItem({ party }: Readonly<{ party: Party }>) {
  const { data: races, isLoading, isError } = useRacesByParty(party.id)

  // Calculate cumulative scores and determine party winner
  const { partyWinner, playerScores } = calculatePartyScores(races || [])

  return (
    <AccordionItem value={`party-${party.id}`}>
      <AccordionTrigger className="hover:bg-muted/50 px-2 sm:px-4 rounded-md">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full">
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
          <span className="text-sm sm:text-base">Party {party.id.toString()}</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground">{new Date(party.datePlayed).toLocaleDateString()}</span>
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
              {races?.length ?? party.racesPlayed?.length ?? 0} races
            </Badge>
            {partyWinner && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 hidden xs:flex">
                <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-amber-500" />
                <span className="truncate max-w-[60px] sm:max-w-none">{partyWinner.racer.userName}</span>
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2 sm:px-4">
        {isLoading ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-10 sm:h-12 w-full" />
            <Skeleton className="h-10 sm:h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="text-red-500 py-2 text-sm">Error loading races</div>
        ) : races?.length === 0 ? (
          <div className="text-muted-foreground py-2 text-sm">No races found for this party</div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Player Rankings - FIRST */}
            {playerScores.length > 0 && (
              <div className="bg-muted/50 p-3 sm:p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  <span className="font-medium text-base sm:text-lg">Player Rankings</span>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {playerScores.map((player, index) => (
                    <div
                      key={player.racer.id.toString()}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded ${
                        index === 0 ? "bg-amber-900 border border-amber-200" : "bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <span className="font-medium text-muted-foreground text-sm">{index + 1}.</span>
                        <span className={`${index === 0 ? "font-medium" : ""} text-sm truncate`}>{player.racer.userName}</span>
                        {index === 0 && <Medal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-200 shrink-0" />}
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs shrink-0">{player.totalScore} pts</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Party Winner Section - SECOND */}
            {partyWinner && (
              <div className="border p-3 sm:p-4 rounded-md border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                  <span className="font-medium text-base sm:text-lg">Party Champion</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-medium text-lg sm:text-xl">{partyWinner.racer.userName}</div>
                  <div className="text-xs sm:text-sm">
                    Total Score: <span className="font-medium">{partyWinner.totalScore} points</span> in{" "}
                    <span className="font-medium">{partyWinner.raceCount} races</span>
                  </div>
                </div>
              </div>
            )}

            {/* Races - THIRD */}
            <div>
              <h3 className="font-medium text-base sm:text-lg mb-2 sm:mb-3">Races</h3>
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
        winningRacer = score.user ?? null
      }
    })

    return winningRacer ? { racer: winningRacer, score: highestScore } : null
  }

  const winner = getWinner()
  const parameters = race.raceParameters && race.raceParameters.length > 0 ? race.raceParameters[0] : null

  return (
    <AccordionItem value={`race-${race.id}`}>
      <AccordionTrigger className="hover:bg-muted/50 px-2 sm:px-4 rounded-md">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full">
          <Flag className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
          <span className="text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">{parameters?.name || `Race ${race.id.toString()}`}</span>
          {race.party?.datePlayed && (
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {new Date(race.party.datePlayed).toLocaleDateString()}
            </span>
          )}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
              {race.racers?.length || 0} racers
            </Badge>
            {winner && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 hidden xs:flex">
                <Trophy className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-amber-500" />
                <span className="truncate max-w-[50px] sm:max-w-none">{winner.racer.userName}</span>
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2 sm:px-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Winner section */}
          <div className="bg-muted/50 p-3 sm:p-4 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              <span className="font-medium text-sm sm:text-base">Winner</span>
            </div>

            {winner ? (
              <div className="flex flex-col gap-1">
                <div className="font-medium text-sm sm:text-base">{winner.racer.userName}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Score: {winner.score}</div>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-muted-foreground">No winner recorded</div>
            )}
          </div>

          {/* Race parameters section */}
          {parameters && (
            <div className="bg-muted/50 p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <span className="font-medium text-sm sm:text-base">Parameters</span>
              </div>
              <div className="text-xs sm:text-sm space-y-1">
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
            <div className="bg-muted/50 p-3 sm:p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="font-medium text-sm sm:text-base">Racers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {race.racers.map((racer) => {
                  const racerScore = race.scores?.find((score) => score.user?.id === racer.id)?.value
                  return (
                    <div
                      key={racer.id.toString()}
                      className="flex items-center justify-between p-2 bg-background rounded text-sm"
                    >
                      <span className="truncate">{racer.userName}</span>
                      {racerScore !== undefined && <Badge variant="secondary" className="text-xs shrink-0 ml-2">{racerScore} pts</Badge>}
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
        if (!score.user) return;
        
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
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center justify-center gap-2">
          <Skeleton className="h-4 w-4 sm:h-5 sm:w-5" />
          <Skeleton className="h-5 sm:h-6 w-28 sm:w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-2 sm:px-4 md:px-6">
        <Skeleton className="h-12 sm:h-16 w-full" />
        <Skeleton className="h-12 sm:h-16 w-full" />
        <Skeleton className="h-12 sm:h-16 w-full" />
      </CardContent>
    </Card>
  )
}
