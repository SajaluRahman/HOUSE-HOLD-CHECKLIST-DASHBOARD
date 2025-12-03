"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Observation } from "@/lib/types"

interface ObservationFormProps {
  onSubmit: (data: Omit<Observation, "id">) => void
  onCancel: () => void
  initialData?: Observation | null
}

export default function ObservationForm({ onSubmit, onCancel, initialData }: ObservationFormProps) {
  const [formData, setFormData] = useState({
    observation: "",
    personResponsible: "",
    actionPlan: "",
    timeFrame: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        observation: initialData.observation,
        personResponsible: initialData.personResponsible,
        actionPlan: initialData.actionPlan,
        timeFrame: initialData.timeFrame,
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.observation.trim() && formData.personResponsible.trim()) {
      onSubmit({
        observation: formData.observation.trim(),
        personResponsible: formData.personResponsible.trim(),
        actionPlan: formData.actionPlan.trim(),
        timeFrame: formData.timeFrame.trim(),
      })
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
      <div className="p-6 border-b border-[#D7DDE5] bg-[#1D3C8F]">
        <h3 className="text-lg font-semibold text-white">{initialData ? "Edit Observation" : "Add New Observation"}</h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Observations</label>
            <textarea
              value={formData.observation}
              onChange={(e) => updateField("observation", e.target.value)}
              placeholder="Enter observation details"
              rows={3}
              autoFocus
              className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2] resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Person Responsible</label>
              <input
                type="text"
                value={formData.personResponsible}
                onChange={(e) => updateField("personResponsible", e.target.value)}
                placeholder="Enter person name"
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Time Frame</label>
              <input
                type="text"
                value={formData.timeFrame}
                onChange={(e) => updateField("timeFrame", e.target.value)}
                placeholder="e.g., 2 weeks"
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Action Plan</label>
            <textarea
              value={formData.actionPlan}
              onChange={(e) => updateField("actionPlan", e.target.value)}
              placeholder="Enter action plan"
              rows={3}
              className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2] resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.observation.trim() || !formData.personResponsible.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors disabled:opacity-50"
            >
              {initialData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
