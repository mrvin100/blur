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
  raceId: string | undefined
}

export function ScoreForm({ raceId }: ScoreFormProps) {
  const [selectedRacer, setSelectedRacer] = useState<string>("")
  const [score, setScore] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { fetchRaceById } = useRace(raceId)
  const { fetchScoreByRaceId, updateScore, addScore } = useScore(raceId)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRacer || !score || !raceId) {
      toast.error("Veuillez sélectionner un joueur et entrer un rang");
      return
    }

    setLoading(true)
    const data: AddScoreRequestData = {
      value: Number(score),
      raceId: raceId,
      userId: selectedRacer
    }

    try {
      const existingScore = fetchRaceById.data?.scores.find((s) => s.user.id == selectedRacer)
      console.log("Existing Score", existingScore)
      await updateScore.mutateAsync({ data, scoreId: existingScore!.id })


      toast.success("Succès", {
        description: "Le rang a été enregistré avec succès"
      })

      setSelectedRacer("")
      setScore("")

    } catch (e) {
      console.error("Erreur:", e)
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'enregistrement"
      })
    } finally {
      setLoading(false)
      await fetchRaceById.refetch()
      await fetchScoreByRaceId.refetch()
    }
  }

  if (fetchRaceById.data && fetchRaceById.data.racers.length === 0) {
    return (
      <div className="text-center py-6 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">Ajoutez des participants à la course pour pouvoir ajouter des rangs</p>
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
          <Label htmlFor="score">Rang</Label>
          <Input
            id="score"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Entrer le rang"
            className="w-full"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full md:w-auto">
        {loading ? "Ajout en cours..." : "Ajouter le rang"}
      </Button>
    </form>
  )
}

