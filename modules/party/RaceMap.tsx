"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { MapPin, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRace, useChangeCard } from "@/hooks"

interface Props {
  raceId: string
  canChangeCard?: boolean
}

export function RaceMap({ raceId, canChangeCard = true }: Props) {
  const { data: race } = useRace(raceId)
  const changeCard = useChangeCard()
  
  const hasMap = !!race?.card
  const isPending = race?.status === "PENDING"
  const canChange = canChangeCard && isPending

  const handleChangeCard = () => {
    if (!canChange) return
    changeCard.mutate(raceId)
  }

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="flex justify-between items-center text-lg">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Circuit
          </div>
          {canChange && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleChangeCard} 
              disabled={changeCard.isPending}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${changeCard.isPending ? 'animate-spin' : ''}`} />
              Changer la carte
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {changeCard.isPending ? (
          <div className="py-16 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <p>Changement de carte...</p>
            </div>
          </div>
        ) : race && hasMap ? (
          <div className="space-y-4">
            <div className="relative h-48 w-full overflow-hidden rounded-md shadow-md">
              <Image src={race.card?.imageUrl || "/placeholder.svg"} alt={race.card?.track || "Track"} fill className="object-cover" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{race.card?.track}</h3>
              <p className="text-muted-foreground">{race.card?.location}</p>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Aucun circuit sélectionné</p>
            {canChange && (
              <Button 
                variant="outline" 
                onClick={handleChangeCard}
                disabled={changeCard.isPending}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Attribuer une carte
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

