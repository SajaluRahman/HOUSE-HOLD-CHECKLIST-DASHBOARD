"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { AuditItem, Timeframe } from "@/lib/types"

interface AuditItemFormProps {
  onSubmitMultiple: (items: Omit<AuditItem, "id" | "status" | "createdAt">[]) => void
  onSubmitSingle: (item: Omit<AuditItem, "id" | "status" | "createdAt">) => void
  onCancel: () => void
  initialData?: AuditItem | null
  categoryName: string
  isEditing: boolean
}

interface ItemDraft {
  id: string
  element: string
  comments: string
  timeframe: Timeframe
}

// Timeframe options with colors
const TIMEFRAMES: { value: Timeframe; label: string; color: string }[] = [
  { value: "Immediate", label: "Immediate", color: "#DC2626" },
  { value: "Urgent", label: "Urgent", color: "#F59E0B" },
  { value: "Ongoing", label: "Ongoing", color: "#10B981" },
  { value: "Open", label: "Open", color: "#3B82F6" },
]

export default function AuditItemForm({
  onSubmitMultiple,
  onSubmitSingle,
  onCancel,
  initialData,
  categoryName,
  isEditing,
}: AuditItemFormProps) {
  // State for multiple items
  const [items, setItems] = useState<ItemDraft[]>([{ id: "1", element: "", comments: "", timeframe: "Open" }])

  // State for editing single item
  const [editData, setEditData] = useState({
    element: "",
    comments: "",
    timeframe: "Open" as Timeframe,
  })

  // State for dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Load initial data when editing
  useEffect(() => {
    if (initialData && isEditing) {
      setEditData({
        element: initialData.element,
        comments: initialData.comments,
        timeframe: initialData.timeframe,
      })
    }
  }, [initialData, isEditing])

  // Update item field
  const updateItem = (id: string, field: keyof ItemDraft, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    setOpenDropdown(null)
  }

  // Add new item
  const addNewItem = () => {
    setItems([...items, { id: Date.now().toString(), element: "", comments: "", timeframe: "Open" }])
  }

  // Remove item
  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  // Submit multiple items
  const handleDone = () => {
    const validItems = items.filter((item) => item.element.trim())
    if (validItems.length > 0) {
      onSubmitMultiple(
        validItems.map((item) => ({
          element: item.element.trim(),
          comments: item.comments.trim(),
          timeframe: item.timeframe,
        })),
      )
    }
  }

  // Submit single item (edit)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editData.element.trim()) {
      onSubmitSingle({
        element: editData.element.trim(),
        comments: editData.comments.trim(),
        timeframe: editData.timeframe,
      })
    }
  }

  // Get color for timeframe
  const getTimeframeColor = (tf: Timeframe) => {
    return TIMEFRAMES.find((t) => t.value === tf)?.color || "#3B82F6"
  }

  // Edit form
  if (isEditing && initialData) {
    return (
      <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#D7DDE5] bg-[#1D3C8F]">
          <h3 className="text-lg font-semibold text-white">Edit Item - {categoryName}</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Element</label>
              <input
                type="text"
                value={editData.element}
                onChange={(e) => setEditData({ ...editData, element: e.target.value })}
                placeholder="Enter element name"
                autoFocus
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Comments</label>
              <textarea
                value={editData.comments}
                onChange={(e) => setEditData({ ...editData, comments: e.target.value })}
                placeholder="Enter comments"
                rows={3}
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Action Timeframe</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "edit" ? null : "edit")}
                  className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg text-left flex items-center justify-between bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getTimeframeColor(editData.timeframe) }}
                    />
                    {editData.timeframe}
                  </div>
                  <span>▼</span>
                </button>
                {openDropdown === "edit" && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#D7DDE5] rounded-lg shadow-lg">
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf.value}
                        type="button"
                        onClick={() => {
                          setEditData({ ...editData, timeframe: tf.value })
                          setOpenDropdown(null)
                        }}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-[#F6F7F9]"
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tf.color }} />
                        {tf.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                disabled={!editData.element.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Add multiple items form
  return (
    <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
      <div className="p-6 border-b border-[#D7DDE5] bg-[#1D3C8F]">
        <h3 className="text-lg font-semibold text-white">Add Items - {categoryName}</h3>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="p-4 border border-[#D7DDE5] rounded-lg space-y-4 bg-[#F6F7F9]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#2E2E2E]/60">Item {index + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Element</label>
              <input
                type="text"
                value={item.element}
                onChange={(e) => updateItem(item.id, "element", e.target.value)}
                placeholder="Enter element name"
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2] bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Comments</label>
              <textarea
                value={item.comments}
                onChange={(e) => updateItem(item.id, "comments", e.target.value)}
                placeholder="Enter comments"
                rows={2}
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2] resize-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Action Timeframe</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                  className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg text-left flex items-center justify-between bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getTimeframeColor(item.timeframe) }}
                    />
                    {item.timeframe}
                  </div>
                  <span>▼</span>
                </button>
                {openDropdown === item.id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#D7DDE5] rounded-lg shadow-lg">
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf.value}
                        type="button"
                        onClick={() => updateItem(item.id, "timeframe", tf.value)}
                        className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-[#F6F7F9]"
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tf.color }} />
                        {tf.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addNewItem}
          className="w-full px-4 py-3 text-sm font-medium text-[#17A2A2] bg-white border-2 border-dashed border-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/5 transition-colors"
        >
          + Add Another Item
        </button>

        <div className="flex gap-3 justify-end pt-4 border-t border-[#D7DDE5]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={!items.some((item) => item.element.trim())}
            className="px-6 py-2 text-sm font-medium text-white bg-[#1D3C8F] rounded-lg hover:bg-[#1D3C8F]/90 transition-colors disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
