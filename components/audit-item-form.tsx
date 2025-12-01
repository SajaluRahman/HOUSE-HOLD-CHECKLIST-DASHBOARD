"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const timeframes: { value: Timeframe; label: string; color: string }[] = [
  { value: "Immediate", label: "Immediate", color: "bg-priority-immediate" },
  { value: "Urgent", label: "Urgent", color: "bg-priority-urgent" },
  { value: "Ongoing", label: "Ongoing", color: "bg-priority-ongoing" },
  { value: "Open", label: "Open", color: "bg-priority-open" },
]

export function AuditItemForm({
  onSubmitMultiple,
  onSubmitSingle,
  onCancel,
  initialData,
  categoryName,
  isEditing,
}: AuditItemFormProps) {
  const [items, setItems] = useState<ItemDraft[]>([
    { id: Date.now().toString(), element: "", comments: "", timeframe: "Open" },
  ])

  // For editing single item
  const [editElement, setEditElement] = useState("")
  const [editComments, setEditComments] = useState("")
  const [editTimeframe, setEditTimeframe] = useState<Timeframe>("Open")

  useEffect(() => {
    if (initialData && isEditing) {
      setEditElement(initialData.element)
      setEditComments(initialData.comments)
      setEditTimeframe(initialData.timeframe)
    }
  }, [initialData, isEditing])

  const updateItem = (id: string, field: keyof ItemDraft, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const addNewItem = () => {
    setItems([...items, { id: Date.now().toString(), element: "", comments: "", timeframe: "Open" }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editElement.trim()) {
      onSubmitSingle({
        element: editElement.trim(),
        comments: editComments.trim(),
        timeframe: editTimeframe,
      })
    }
  }

  // Editing mode - single item form
  if (isEditing && initialData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Item - {categoryName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="element">Element</Label>
              <Input
                id="element"
                value={editElement}
                onChange={(e) => setEditElement(e.target.value)}
                placeholder="Enter element name"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={editComments}
                onChange={(e) => setEditComments(e.target.value)}
                placeholder="Enter comments"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Action Timeframe</Label>
              <Select value={editTimeframe} onValueChange={(v) => setEditTimeframe(v as Timeframe)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${tf.color}`} />
                        {tf.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={!editElement.trim()}>
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Items - {categoryName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="p-4 border rounded-lg space-y-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
              {items.length > 1 && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label>Element</Label>
              <Input
                value={item.element}
                onChange={(e) => updateItem(item.id, "element", e.target.value)}
                placeholder="Enter element name"
              />
            </div>
            <div className="space-y-2">
              <Label>Comments</Label>
              <Textarea
                value={item.comments}
                onChange={(e) => updateItem(item.id, "comments", e.target.value)}
                placeholder="Enter comments"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Action Timeframe</Label>
              <Select value={item.timeframe} onValueChange={(v) => updateItem(item.id, "timeframe", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${tf.color}`} />
                        {tf.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addNewItem} className="w-full gap-2 bg-transparent">
          <Plus className="w-4 h-4" />
          Add Another Item
        </Button>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleDone} disabled={!items.some((item) => item.element.trim())}>
            Done
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
