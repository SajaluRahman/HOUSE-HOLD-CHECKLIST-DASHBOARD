"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { Observation } from "@/lib/types"

interface ObservationFormProps {
  onSubmit: (data: Omit<Observation, "id">) => void
  onCancel: () => void
  initialData?: Observation | null
}

export function ObservationForm({ onSubmit, onCancel, initialData }: ObservationFormProps) {
  const [observation, setObservation] = useState("")
  const [personResponsible, setPersonResponsible] = useState("")
  const [actionPlan, setActionPlan] = useState("")
  const [timeFrame, setTimeFrame] = useState("")

  useEffect(() => {
    if (initialData) {
      setObservation(initialData.observation)
      setPersonResponsible(initialData.personResponsible)
      setActionPlan(initialData.actionPlan)
      setTimeFrame(initialData.timeFrame)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (observation.trim() && personResponsible.trim()) {
      onSubmit({
        observation: observation.trim(),
        personResponsible: personResponsible.trim(),
        actionPlan: actionPlan.trim(),
        timeFrame: timeFrame.trim(),
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Observation" : "Add New Observation"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observation">Observations</Label>
            <Textarea
              id="observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Enter observation details"
              rows={3}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="person">Person Responsible</Label>
              <Input
                id="person"
                value={personResponsible}
                onChange={(e) => setPersonResponsible(e.target.value)}
                placeholder="Enter person name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Time Frame</Label>
              <Input
                id="timeframe"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                placeholder="e.g., 2 weeks, End of month"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="action">Action Plan</Label>
            <Textarea
              id="action"
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="Enter action plan"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!observation.trim() || !personResponsible.trim()}>
              {initialData ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
