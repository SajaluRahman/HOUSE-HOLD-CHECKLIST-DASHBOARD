// components/SimpleAddForm.tsx
"use client"

import { useState } from "react"

interface Props {
  categoryName: string
  onAdd: (elements: string[]) => void
  onCancel: () => void
}

export default function SimpleAddForm({ categoryName, onAdd, onCancel }: Props) {
  const [items, setItems] = useState<string[]>([""])

  const addField = () => setItems([...items, ""])
  const update = (i: number, val: string) => {
    const newItems = [...items]
    newItems[i] = val
    setItems(newItems)
  }

  const submit = () => {
    const valid = items.map(s => s.trim()).filter(Boolean)
    if (valid.length > 0) {
      onAdd(valid)
      setItems([""])
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-[#1D3C8F] to-[#17A2A2] p-6 text-white">
        <h3 className="text-2xl font-bold">Add Audit Items — {categoryName}</h3>
      </div>
      <div className="p-8 space-y-4">
        {items.map((val, i) => (
          <input
            key={i}
            type="text"
            value={val}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Item ${i + 1} (e.g., Ceiling tiles damaged)`}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-[#17A2A2] focus:outline-none text-lg"
            autoFocus
          />
        ))}

        <button
          onClick={addField}
          className="w-full py-4 border-2 border-dashed border-[#17A2A2] text-[#17A2A2] rounded-xl font-semibold hover:bg-[#17A2A2]/5 transition"
        >
          + Add Another Item
        </button>

        <div className="flex justify-end gap-4 pt-6">
          <button onClick={onCancel} className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!items.some(s => s.trim())}
            className="px-10 py-3 bg-[#17A2A2] text-white rounded-xl font-bold rounded-xl hover:bg-[#17A2A2]/90 shadow-lg disabled:opacity-50"
          >
            Add Items
          </button>
        </div>
      </div>
    </div>
  )
}