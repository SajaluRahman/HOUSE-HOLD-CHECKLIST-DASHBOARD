// components/UpdateDetailsModal.tsx
"use client"

import { useState } from "react"

type Timeframe = "Immediate" | "Urgent" | "Ongoing" | "Open"

const TIMEFRAMES = [
  { value: "Immediate" as const, label: "Immediate", color: "#DC2626" },
  { value: "Urgent" as const,   label: "Urgent",   color: "#F59E0B" },
  { value: "Ongoing" as const,  label: "Ongoing",  color: "#10B981" },
  { value: "Open" as const,     label: "Open",     color: "#3B82F6" },
]

interface Props {
  item: { id: string; element: string; comments?: string; timeframe?: Timeframe }
  isOpen: boolean
  onClose: () => void
  onSave: (comments: string, timeframe: Timeframe) => void
}

export default function UpdateDetailsModal({ item, isOpen, onClose, onSave }: Props) {
  const [comments, setComments] = useState(item.comments || "")
  const [timeframe, setTimeframe] = useState<Timeframe>(item.timeframe || "Open")

  if (!isOpen) return null

  const handleSave = () => {
    onSave(comments.trim(), timeframe)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#1D3C8F] to-[#17A2A2] p-6 text-white">
          <h3 className="text-xl font-bold">Update Details</h3>
          <p className="opacity-90 mt-1 text-sm">{item.element}</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comments / Action Required</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="e.g., Replace broken tile, repaint wall, fix leak..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#17A2A2] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Action Timeframe</label>
            <div className="grid grid-cols-2 gap-3">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                    timeframe === tf.value ? "ring-4 ring-white ring-offset-2 ring-offset-[#17A2A2]" : ""
                  }`}
                  style={{ backgroundColor: tf.color }}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-[#17A2A2] text-white rounded-xl hover:bg-[#17A2A2]/90 font-semibold shadow-lg"
            >
              Save Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}