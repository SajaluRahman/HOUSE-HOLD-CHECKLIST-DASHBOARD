"use client"

import type { AuditItem, Timeframe } from "@/lib/types"

interface AuditTableProps {
  items: AuditItem[]
  categoryId: string
  onToggleStatus: (categoryId: string, itemId: string, status: "checked" | "crossed") => void
  onEdit: (item: AuditItem) => void
}

// Timeframe colors
const TIMEFRAME_COLORS: Record<Timeframe, string> = {
  Immediate: "#DC2626",
  Urgent: "#F59E0B",
  Ongoing: "#10B981",
  Open: "#3B82F6",
}

// Format date helper
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return {
    day: date.getDate(),
    month: date.toLocaleString("default", { month: "short" }),
    year: date.getFullYear(),
  }
}

export default function AuditTable({ items, categoryId, onToggleStatus, onEdit }: AuditTableProps) {
  const totalItems = items.length
  const checkedCount = items.filter((item) => item.status === "checked").length

  if (items.length === 0) {
    return (
      <p className="text-center text-[#2E2E2E]/60 py-8">
        No items in this category yet. Click "Add Item" to get started.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#D7DDE5] bg-[#F6F7F9]">
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Element</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Comments</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Timeframe</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#2E2E2E]">Status</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-[#2E2E2E]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const dateInfo = formatDate(item.createdAt)
            const isCrossed = item.status === "crossed"
            const isChecked = item.status === "checked"

            return (
              <tr key={item.id} className="border-b border-[#D7DDE5]/50 hover:bg-[#F6F7F9]">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#2E2E2E]">
                      {dateInfo.day} <span className="text-[#17A2A2] font-semibold">{dateInfo.month}</span>
                    </span>
                    <span className="text-xs text-[#2E2E2E]/60">{dateInfo.year}</span>
                  </div>
                </td>
                <td
                  className={`px-4 py-3 font-medium ${isCrossed ? "line-through text-[#2E2E2E]/40" : "text-[#2E2E2E]"}`}
                >
                  {item.element}
                </td>
                <td className={`px-4 py-3 ${isCrossed ? "line-through text-[#2E2E2E]/40" : "text-[#2E2E2E]/80"}`}>
                  {item.comments || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: TIMEFRAME_COLORS[item.timeframe] }}
                  >
                    {item.timeframe}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {isChecked && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#17A2A2] text-white text-sm">
                      ✓
                    </span>
                  )}
                  {isCrossed && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white text-sm">
                      ✗
                    </span>
                  )}
                  {!isChecked && !isCrossed && <span className="text-[#2E2E2E]/40">-</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onToggleStatus(categoryId, item.id, "checked")}
                      title="Mark as checked"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isChecked
                          ? "bg-[#17A2A2] text-white"
                          : "border border-[#D7DDE5] text-[#2E2E2E] hover:bg-[#17A2A2]/10"
                      }`}
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onToggleStatus(categoryId, item.id, "crossed")}
                      title="Mark as crossed"
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isCrossed ? "bg-red-500 text-white" : "border border-[#D7DDE5] text-[#2E2E2E] hover:bg-red-50"
                      }`}
                    >
                      ✗
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      title="Edit item"
                      className="w-8 h-8 rounded-lg border border-[#D7DDE5] text-[#2E2E2E] hover:bg-[#F6F7F9] flex items-center justify-center transition-colors"
                    >
                      ✎
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bg-[#1D3C8F]/5">
            <td colSpan={4} className="px-4 py-3 font-semibold text-[#1D3C8F]">
              Total Completed
            </td>
            <td className="px-4 py-3 text-center font-bold text-[#17A2A2] text-lg">
              {checkedCount} / {totalItems}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
