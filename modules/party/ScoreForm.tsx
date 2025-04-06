"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Racer } from "@/types/party.types"
import { useScore } from "@/hooks/useScore"
import { useRace } from "@/hooks/useRace"
import { AddScoreRequestData } from "@/types/score.types"

interface ScoreFormProps {
  raceId: string
}

export function ScoreForm({ raceId }: ScoreFormProps) {
  const [racers, setRacers] = useState<Racer[]>([])
  const [selectedRacer, setSelectedRacer] = useState<string>("")
  const [score, setScore] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { addScore } = useScore()
  const { fetchRaceById } = useRace(raceId)

  useEffect(() => {
    fetchRaceRacers()
  }, [raceId])

  const fetchRaceRacers = async () => {
    try {
      const data = fetchRaceById.data
      if (data && data.racers) {
        setRacers(data.racers)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des joueurs:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRacer || !score) {
      toast("Erreur",
        { description: "Veuillez sélectionner un joueur et entrer un score" }
      )
      return
    }

    setLoading(true)
    const newScore: AddScoreRequestData = {
      value: Number.parseInt(score),
      raceId: raceId,
      userId: selectedRacer
    }
    return addScore.mutateAsync(newScore).then(res => {
      toast(
        "Succès", {
        description: "Le score a été ajouté avec succès"
      },
      )
      setLoading(false)
      fetchRaceById.refetch()
      setSelectedRacer("")
      setScore("")
    }).catch(e => {
      console.error("Erreur lors de l'ajout du score:", e)
      toast("Erreur",
        { description: "Une erreur est survenue lors de l'ajout du score" }
      )
    })
  }

  if (fetchRaceById.data && fetchRaceById.data.racers.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">Ajoutez des participants à la course pour pouvoir ajouter des scores</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="racer">Participant</Label>
          <Select value={selectedRacer} onValueChange={setSelectedRacer}>
            <SelectTrigger id="racer" className="w-full">
              <SelectValue placeholder="Sélectionner un participant" />
            </SelectTrigger>
            <SelectContent>
              {fetchRaceById.data && fetchRaceById.data.racers.map((racer) => (
                <SelectItem key={racer.id} value={racer.id.toString()}>
                  {racer.userName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Entrer le score"
            className="w-full"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Ajout en cours..." : "Ajouter le score"}
      </Button>
    </form>
  )
}

