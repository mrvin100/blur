"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Dices, MapPin } from "lucide-react"
import { Map } from "@/types/map.types"
import { useMaps } from "@/hooks/useMaps"
import { Button } from "@/components/ui/button"
import { useRace } from "@/hooks/useRace"
import { getRandomMap } from "@/app/services/mapService"
interface Props {
  raceId: string
}
export function RaceMap({ raceId }: Props) {
  const [map, setMap] = useState<Map | null>(null)
  const [loading, setLoading] = useState(false)
  const { fetchRaceById } = useRace(raceId)
  const hasMap = !!fetchRaceById.data?.card

  const fetchRandomMap = async () => {
    try {
      setLoading(true)
      await getRandomMap(raceId)
      await fetchRaceById.refetch()
    } catch (error) {
      console.error("Erreur lors de la récupération de la carte:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="pb-2 bg-muted/30">
        <CardTitle className="flex justify-between items-center text-lg">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Circuit
          </div>
          <Button variant="outline" size="sm" onClick={fetchRandomMap} disabled={loading}>
            <Dices className="h-4 w-4 mr-1" />
            Tirer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="py-16 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <p>Tirage en cours...</p>
            </div>
          </div>
        ) : fetchRaceById.data && hasMap ? (
          <div className="space-y-4">
            <div className="relative h-48 w-full overflow-hidden rounded-md shadow-md">
              <Image src={fetchRaceById.data.card.imageUrl || "/placeholder.svg"} alt={fetchRaceById.data.card.track} fill className="object-cover" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">{fetchRaceById.data.card.track}</h3>
              <p className="text-muted-foreground">{fetchRaceById.data.card.location}</p>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Aucun circuit sélectionné</p>
            <Button variant="outline" onClick={fetchRandomMap}>
              <Dices className="h-4 w-4 mr-2" />
              Tirer un circuit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

