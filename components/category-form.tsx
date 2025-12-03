"use client"

import type React from "react"

import { useState } from "react"

interface CategoryFormProps {
  onSubmit: (name: string) => void
  onCancel: () => void
}

export default function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim())
    }
  }

  return (
    <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
      <div className="p-6 border-b border-[#D7DDE5] bg-[#1D3C8F]">
        <h3 className="text-lg font-semibold text-white">Add New Category</h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              autoFocus
              className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2] focus:border-transparent"
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
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
