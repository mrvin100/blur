"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Racer } from "@/types/party.types"
import { useRace, useScoresByRace, useSubmitScore, useUpdateScore } from "@/hooks"
import { AddScoreRequestData } from "@/types/score.types"

interface ScoreFormProps {
  raceId: string | undefined
}

export function ScoreForm({ raceId }: ScoreFormProps) {
  const [selectedRacer, setSelectedRacer] = useState<string>("")
  const [score, setScore] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { data: race, refetch: refetchRace } = useRace(raceId || "0")
  const { data: scores, refetch: refetchScores } = useScoresByRace(raceId || "0")
  const submitScore = useSubmitScore()
  const updateScore = useUpdateScore()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedRacer || !score || !raceId) {
      toast.error("Veuillez sélectionner un joueur et entrer un rang");
      return
    }

    setLoading(true)
    const data: AddScoreRequestData = {
      value: Number(score),
      raceId: Number(raceId),
      userId: Number(selectedRacer)
    }

    try {
      const existingScore = race?.scores?.find((s) => s.user?.id == Number(selectedRacer))
      
      if (existingScore) {
        await updateScore.mutateAsync({ 
          id: existingScore.id, 
          data: { 
            value: Number(score),
            raceId: Number(raceId),
            userId: Number(selectedRacer)
          } 
        })
      } else {
        await submitScore.mutateAsync({
          value: Number(score),
          raceId: Number(raceId),
          userId: Number(selectedRacer)
        })
      }

      setSelectedRacer("")
      setScore("")

    } catch {
      toast.error("Erreur lors de l'ajout du score");
    } finally {
      setLoading(false)
      await refetchRace()
      await refetchScores()
    }
  }

  if (race && race.racers && race.racers.length === 0) {
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
              {race?.racers?.map((racer) => (
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

