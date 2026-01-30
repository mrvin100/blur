"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRace, useMaps } from "@/hooks"
interface Props {
  raceId: string
}
export function RaceMap({ raceId }: Props) {
  const [loading, setLoading] = useState(false)
  const { data: race, refetch } = useRace(raceId)
  // Maps list may be used for future manual override UI
  useMaps()
  const hasMap = !!race?.card

  // Map/card is assigned automatically by the backend when the race starts.
  // Manual overrides may be implemented later (UI intentionally read-only for now).
  const fetchRandomMap = async () => {
    setLoading(true)
    await refetch()
    setLoading(false)
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
            Reload
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="py-16 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
              <p>Chargement...</p>
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
            <p className="text-muted-foreground mb-4">Aucun circuit sélectionné (la carte est fixée à la création de la course)</p>
            <Button variant="outline" onClick={fetchRandomMap}>Reload</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

