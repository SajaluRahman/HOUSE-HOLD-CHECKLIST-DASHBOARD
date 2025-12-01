"use client"

import { Check, X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { AuditItem, Timeframe } from "@/lib/types"

interface AuditTableProps {
  items: AuditItem[]
  categoryId: string
  onToggleStatus: (categoryId: string, itemId: string, status: "checked" | "crossed") => void
  onEdit: (item: AuditItem) => void
}

const timeframeColors: Record<Timeframe, string> = {
  Immediate: "bg-priority-immediate text-primary-foreground",
  Urgent: "bg-priority-urgent text-primary-foreground",
  Ongoing: "bg-priority-ongoing text-primary-foreground",
  Open: "bg-priority-open text-primary-foreground",
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "short" })
  const year = date.getFullYear()
  return { day, month, year, full: `${day} ${month} ${year}` }
}

export function AuditTable({ items, categoryId, onToggleStatus, onEdit }: AuditTableProps) {
  const totalItems = items.length
  const checkedCount = items.filter((item) => item.status === "checked").length

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No items in this category yet. Click "Add Item" to get started.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Date</TableHead>
          <TableHead className="w-[180px]">Element</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead className="w-[120px]">Timeframe</TableHead>
          <TableHead className="w-[120px] text-center">Out of Mark</TableHead>
          <TableHead className="w-[140px] text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const dateInfo = formatDate(item.createdAt)
          return (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {dateInfo.day} {dateInfo.month}
                  </span>
                  <span className="text-xs text-muted-foreground">{dateInfo.year}</span>
                </div>
              </TableCell>
              <TableCell
                className={cn("font-medium", item.status === "crossed" && "line-through text-muted-foreground")}
              >
                {item.element}
              </TableCell>
              <TableCell className={cn(item.status === "crossed" && "line-through text-muted-foreground")}>
                {item.comments || "-"}
              </TableCell>
              <TableCell>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", timeframeColors[item.timeframe])}>
                  {item.timeframe}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {item.status === "checked" ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    <Check className="w-4 h-4" />
                  </span>
                ) : item.status === "crossed" ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                    <X className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    size="icon"
                    variant={item.status === "checked" ? "default" : "outline"}
                    className="h-8 w-8"
                    onClick={() => onToggleStatus(categoryId, item.id, "checked")}
                    title="Mark as checked"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={item.status === "crossed" ? "destructive" : "outline"}
                    className="h-8 w-8"
                    onClick={() => onToggleStatus(categoryId, item.id, "crossed")}
                    title="Mark as crossed"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => onEdit(item)}
                    title="Edit item"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4} className="font-semibold">
            Total Completed
          </TableCell>
          <TableCell className="text-center font-bold text-primary">
            {checkedCount} / {totalItems}
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  )
}
