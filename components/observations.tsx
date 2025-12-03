"use client"

import { useState } from "react"
import ObservationForm from "@/components/observation-form"
import type { Observation } from "@/lib/types"

interface ObservationsProps {
  observations: Observation[]
  setObservations: (observations: Observation[]) => void
}

export default function Observations({ observations, setObservations }: ObservationsProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingObservation, setEditingObservation] = useState<Observation | null>(null)

  // Add observation - ready for API
  const handleAdd = (data: Omit<Observation, "id">) => {
    const newObservation: Observation = {
      ...data,
      id: Date.now().toString(),
    }
    setObservations([...observations, newObservation])
    setShowForm(false)
  }

  // Edit observation - ready for API
  const handleEdit = (data: Omit<Observation, "id">) => {
    if (!editingObservation) return
    setObservations(observations.map((obs) => (obs.id === editingObservation.id ? { ...obs, ...data } : obs)))
    setEditingObservation(null)
    setShowForm(false)
  }

  // Delete observation - ready for API
  const handleDelete = (id: string) => {
    setObservations(observations.filter((obs) => obs.id !== id))
  }

  // Export data
  const handleExport = () => {
    const exportData = observations.map((obs, index) => ({
      sNo: index + 1,
      ...obs,
    }))
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "observations.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2E2E2E]">Observations</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingObservation(null)
              setShowForm(true)
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors"
          >
            + Add Observation
          </button>
          {observations.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
            >
              Export
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <ObservationForm
          onSubmit={editingObservation ? handleEdit : handleAdd}
          onCancel={() => {
            setShowForm(false)
            setEditingObservation(null)
          }}
          initialData={editingObservation}
        />
      )}

      {/* Table */}
      {observations.length === 0 ? (
        <div className="bg-white border border-[#D7DDE5] rounded-xl p-12 text-center">
          <p className="text-[#2E2E2E]/60 mb-4">No observations yet. Add your first observation.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
          >
            + Add Observation
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D7DDE5] bg-[#F6F7F9]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E] w-16">S.No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Observations</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Person Responsible</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Action Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Time Frame</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-[#2E2E2E] w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {observations.map((obs, index) => (
                  <tr key={obs.id} className="border-b border-[#D7DDE5]/50 hover:bg-[#F6F7F9]">
                    <td className="px-4 py-3 font-medium text-[#1D3C8F]">{index + 1}</td>
                    <td className="px-4 py-3 text-[#2E2E2E]">{obs.observation}</td>
                    <td className="px-4 py-3 text-[#2E2E2E]">{obs.personResponsible}</td>
                    <td className="px-4 py-3 text-[#2E2E2E]">{obs.actionPlan}</td>
                    <td className="px-4 py-3 text-[#2E2E2E]">{obs.timeFrame}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingObservation(obs)
                            setShowForm(true)
                          }}
                          className="w-8 h-8 rounded-lg border border-[#D7DDE5] text-[#2E2E2E] hover:bg-[#F6F7F9] flex items-center justify-center"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(obs.id)}
                          className="w-8 h-8 rounded-lg border border-[#D7DDE5] text-red-500 hover:bg-red-50 flex items-center justify-center"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
