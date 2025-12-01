"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

export interface DateFilter {
  day?: number
  month?: number
  year?: number
}

interface DateFilterProps {
  onFilterChange: (filter: DateFilter) => void
  activeFilter: DateFilter
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

export function DateFilterComponent({ onFilterChange, activeFilter }: DateFilterProps) {
  const [open, setOpen] = useState(false)
  const [day, setDay] = useState<string>(activeFilter.day?.toString() || "")
  const [month, setMonth] = useState<string>(activeFilter.month?.toString() || "")
  const [year, setYear] = useState<string>(activeFilter.year?.toString() || "")

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="w-4 h-4" />
          Filter
          {hasActiveFilter && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              !
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="font-medium">Filter by Date</div>

          <div className="space-y-2">
            <Label>Day</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((d) => (
                  <SelectItem key={d} value={d.toString()}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={clearFilter} className="flex-1 gap-2 bg-transparent">
              <X className="w-4 h-4" />
              Clear
            </Button>
            <Button onClick={applyFilter} className="flex-1">
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
