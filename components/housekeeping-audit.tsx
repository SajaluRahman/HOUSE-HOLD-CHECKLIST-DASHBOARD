"use client"

import { useState, useMemo } from "react"
import { Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CategoryForm } from "@/components/category-form"
import { AuditItemForm } from "@/components/audit-item-form"
import { AuditTable } from "@/components/audit-table"
import { DateFilterComponent, type DateFilter } from "@/components/date-filter"
import type { Category, AuditItem } from "@/lib/types"

export function HousekeepingAudit() {
  const [categories, setCategories] = useState<Category[]>([])
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<AuditItem | null>(null)
  const [dateFilter, setDateFilter] = useState<DateFilter>({})

  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
    }
    setCategories([...categories, newCategory])
    setSelectedCategoryId(newCategory.id)
    setShowCategoryForm(false)
    setShowItemForm(true)
  }

  const handleAddMultipleItems = (items: Omit<AuditItem, "id" | "status" | "createdAt">[]) => {
    if (!selectedCategoryId) return

    const newItems: AuditItem[] = items.map((item, index) => ({
      ...item,
      id: (Date.now() + index).toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }))

    setCategories(
      categories.map((cat) => (cat.id === selectedCategoryId ? { ...cat, items: [...cat.items, ...newItems] } : cat)),
    )
    setShowItemForm(false)
  }

  const handleEditItem = (item: Omit<AuditItem, "id" | "status" | "createdAt">) => {
    if (!editingItem || !selectedCategoryId) return

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              items: cat.items.map((i) => (i.id === editingItem.id ? { ...i, ...item } : i)),
            }
          : cat,
      ),
    )
    setEditingItem(null)
    setShowItemForm(false)
  }

  const handleToggleStatus = (categoryId: string, itemId: string, status: "checked" | "crossed") => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      status: item.status === status ? "pending" : status,
                    }
                  : item,
              ),
            }
          : cat,
      ),
    )
  }

  const handleExport = () => {
    const exportData = categories.map((cat) => ({
      category: cat.name,
      createdAt: cat.createdAt,
      items: cat.items.map((item) => ({
        element: item.element,
        comments: item.comments,
        timeframe: item.timeframe,
        status: item.status,
        createdAt: item.createdAt,
      })),
      totalChecked: cat.items.filter((i) => i.status === "checked").length,
      totalItems: cat.items.length,
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "housekeeping-audit.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const openItemFormForCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setEditingItem(null)
    setShowItemForm(true)
  }

  const openEditForm = (categoryId: string, item: AuditItem) => {
    setSelectedCategoryId(categoryId)
    setEditingItem(item)
    setShowItemForm(true)
  }

  const filteredCategories = useMemo(() => {
    if (!dateFilter.day && !dateFilter.month && !dateFilter.year) {
      return categories
    }

    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const date = new Date(item.createdAt)
          const matchDay = !dateFilter.day || date.getDate() === dateFilter.day
          const matchMonth = !dateFilter.month || date.getMonth() + 1 === dateFilter.month
          const matchYear = !dateFilter.year || date.getFullYear() === dateFilter.year
          return matchDay && matchMonth && matchYear
        })
        return { ...cat, items: filteredItems }
      })
      .filter((cat) => cat.items.length > 0)
  }, [categories, dateFilter])

  const overallStats = useMemo(() => {
    const allItems = filteredCategories.flatMap((cat) => cat.items)
    return {
      total: allItems.length,
      checked: allItems.filter((i) => i.status === "checked").length,
      crossed: allItems.filter((i) => i.status === "crossed").length,
    }
  }, [filteredCategories])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Housekeeping Audit List</h2>
          {categories.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Overall: {overallStats.checked} of {overallStats.total} completed
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <DateFilterComponent onFilterChange={setDateFilter} activeFilter={dateFilter} />
          <Button onClick={() => setShowCategoryForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
          {categories.length > 0 && (
            <Button variant="outline" onClick={handleExport} className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {showCategoryForm && <CategoryForm onSubmit={handleAddCategory} onCancel={() => setShowCategoryForm(false)} />}

      {showItemForm && selectedCategoryId && (
        <AuditItemForm
          onSubmitMultiple={handleAddMultipleItems}
          onSubmitSingle={handleEditItem}
          onCancel={() => {
            setShowItemForm(false)
            setEditingItem(null)
          }}
          initialData={editingItem}
          categoryName={categories.find((c) => c.id === selectedCategoryId)?.name || ""}
          isEditing={!!editingItem}
        />
      )}

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No categories yet. Add your first category to get started.</p>
            <Button onClick={() => setShowCategoryForm(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No items match the current filter.</p>
            <Button onClick={() => setDateFilter({})} variant="outline">
              Clear Filter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const catDate = new Date(category.createdAt)
            const catDateStr = `${catDate.getDate()} ${catDate.toLocaleString("default", { month: "short" })} ${catDate.getFullYear()}`

            return (
              <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>Created: {catDateStr}</CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openItemFormForCategory(category.id)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </CardHeader>
                <CardContent>
                  <AuditTable
                    items={category.items}
                    categoryId={category.id}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(item) => openEditForm(category.id, item)}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
