"use client"

import { useState } from "react"
import { Plus, Download, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ObservationForm } from "@/components/observation-form"
import type { Observation } from "@/lib/types"

export function Observations() {
  const [observations, setObservations] = useState<Observation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingObservation, setEditingObservation] = useState<Observation | null>(null)

  const handleAddObservation = (data: Omit<Observation, "id">) => {
    const newObservation: Observation = {
      ...data,
      id: Date.now().toString(),
    }
    setObservations([...observations, newObservation])
    setShowForm(false)
  }

  const handleEditObservation = (data: Omit<Observation, "id">) => {
    if (!editingObservation) return
    setObservations(observations.map((obs) => (obs.id === editingObservation.id ? { ...obs, ...data } : obs)))
    setEditingObservation(null)
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setObservations(observations.filter((obs) => obs.id !== id))
  }

  const handleExport = () => {
    const exportData = observations.map((obs, index) => ({
      sNo: index + 1,
      observations: obs.observation,
      personResponsible: obs.personResponsible,
      actionPlan: obs.actionPlan,
      timeFrame: obs.timeFrame,
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "observations.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const openEditForm = (observation: Observation) => {
    setEditingObservation(observation)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Observations</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setEditingObservation(null)
              setShowForm(true)
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Observation
          </Button>
          {observations.length > 0 && (
            <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <ObservationForm
          onSubmit={editingObservation ? handleEditObservation : handleAddObservation}
          onCancel={() => {
            setShowForm(false)
            setEditingObservation(null)
          }}
          initialData={editingObservation}
        />
      )}

      {observations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No observations yet. Add your first observation to get started.
            </p>
            <Button onClick={() => setShowForm(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Observation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">S. No</TableHead>
                  <TableHead>Observations</TableHead>
                  <TableHead>Person Responsible</TableHead>
                  <TableHead>Action Plan</TableHead>
                  <TableHead>Time Frame</TableHead>
                  <TableHead className="w-[100px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {observations.map((obs, index) => (
                  <TableRow key={obs.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{obs.observation}</TableCell>
                    <TableCell>{obs.personResponsible}</TableCell>
                    <TableCell>{obs.actionPlan}</TableCell>
                    <TableCell>{obs.timeFrame}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => openEditForm(obs)}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                          onClick={() => handleDelete(obs.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
