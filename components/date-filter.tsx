"use client"

import { useState, useRef, useEffect } from "react"
import type { DateFilter as DateFilterType } from "@/lib/types"

interface DateFilterProps {
  onFilterChange: (filter: DateFilterType) => void
  activeFilter: DateFilterType
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

export default function DateFilter({ onFilterChange, activeFilter }: DateFilterProps) {
  const [open, setOpen] = useState(false)
  const [day, setDay] = useState<string>(activeFilter.day?.toString() || "")
  const [month, setMonth] = useState<string>(activeFilter.month?.toString() || "")
  const [year, setYear] = useState<string>(activeFilter.year?.toString() || "")
  const [openSelect, setOpenSelect] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
        setOpenSelect(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const applyFilter = () => {
    onFilterChange({
      day: day ? Number.parseInt(day) : undefined,
      month: month ? Number.parseInt(month) : undefined,
      year: year ? Number.parseInt(year) : undefined,
    })
    setOpen(false)
  }

  const clearFilter = () => {
    setDay("")
    setMonth("")
    setYear("")
    onFilterChange({})
    setOpen(false)
  }

  const hasActiveFilter = activeFilter.day || activeFilter.month || activeFilter.year

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors flex items-center gap-2"
      >
        🔍 Filter
        {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-[#17A2A2]" />}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 bg-white border border-[#D7DDE5] rounded-xl shadow-lg p-4 space-y-4">
          <div className="font-semibold text-[#1D3C8F]">Filter by Date</div>

          {/* Day Select */}
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Day</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenSelect(openSelect === "day" ? null : "day")}
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg text-left flex items-center justify-between bg-white"
              >
                <span className={day ? "text-[#2E2E2E]" : "text-[#2E2E2E]/40"}>{day || "Select day"}</span>
                <span>▼</span>
              </button>
              {openSelect === "day" && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D7DDE5] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDay(d.toString())
                        setOpenSelect(null)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#F6F7F9]"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Month Select */}
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Month</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenSelect(openSelect === "month" ? null : "month")}
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg text-left flex items-center justify-between bg-white"
              >
                <span className={month ? "text-[#2E2E2E]" : "text-[#2E2E2E]/40"}>
                  {month ? MONTHS[Number.parseInt(month) - 1] : "Select month"}
                </span>
                <span>▼</span>
              </button>
              {openSelect === "month" && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D7DDE5] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {MONTHS.map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMonth((i + 1).toString())
                        setOpenSelect(null)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#F6F7F9]"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Year Select */}
          <div>
            <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Year</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenSelect(openSelect === "year" ? null : "year")}
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg text-left flex items-center justify-between bg-white"
              >
                <span className={year ? "text-[#2E2E2E]" : "text-[#2E2E2E]/40"}>{year || "Select year"}</span>
                <span>▼</span>
              </button>
              {openSelect === "year" && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D7DDE5] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setYear(y.toString())
                        setOpenSelect(null)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-[#F6F7F9]"
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={clearFilter}
              className="flex-1 px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={applyFilter}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
