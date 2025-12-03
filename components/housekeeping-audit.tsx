"use client"

import { useState, useMemo } from "react"
import CategoryForm from "@/components/category-form"
import AuditItemForm from "@/components/audit-item-form"
import AuditTable from "@/components/audit-table"
import DateFilter from "@/components/date-filter"
import ExcelJS from "exceljs"
import type { Category, AuditItem, DateFilter as DateFilterType } from "@/lib/types"

interface HousekeepingAuditProps {
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

export default function HousekeepingAudit({ categories, setCategories }: HousekeepingAuditProps) {
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<AuditItem | null>(null)
  const [dateFilter, setDateFilter] = useState<DateFilterType>({})

  // Add new category - ready for API
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

  // Add multiple items - ready for API
  const handleAddItems = (items: Omit<AuditItem, "id" | "status" | "createdAt">[]) => {
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

  // Edit item - ready for API
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

  // Toggle status - ready for API
  const handleToggleStatus = (categoryId: string, itemId: string, status: "checked" | "crossed") => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, status: item.status === status ? "pending" : status } : item,
              ),
            }
          : cat,
      ),
    )
  }

  // Export data

const handleExport = async () => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Housekeeping Audit", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  })

  // Define columns - make sure ALL fields are included
  worksheet.columns = [
    { header: "Category", key: "category", width: 22 },
    { header: "Item Name", key: "itemName", width: 35 },
    { header: "Element", key: "element", width: 20 },
    { header: "Comments", key: "comments", width: 40 },
    { header: "Action", key: "action", width: 30 },
    { header: "Frame", key: "frame", width: 18 },
    { header: "Summore", key: "summore", width: 25 },
    { header: "Status", key: "status", width: 14 },
    { header: "Created At", key: "createdAt", width: 16 },
    { header: "Category Created", key: "categoryCreated", width: 18 },
  ]

  // Style the header row
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } }
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF17A2A2" },
  }
  headerRow.alignment = { vertical: "middle", horizontal: "center" }
  headerRow.height = 24

  let totalChecked = 0
  let totalItems = 0

  // Add data from filtered categories
  filteredCategories.forEach((category) => {
    const categoryCreatedDate = new Date(category.createdAt)
    const categoryDateStr = `${categoryCreatedDate.getDate()} ${categoryCreatedDate.toLocaleString("default", { month: "short" })} ${categoryCreatedDate.getFullYear()}`

    if (category.items.length === 0) {
      worksheet.addRow({
        category: category.name,
        itemName: "(No items in this category)",
        status: "",
        categoryCreated: categoryDateStr,
      })
      return
    }

    category.items.forEach((item) => {
      const itemDate = new Date(item.createdAt)
      const itemDateStr = `${itemDate.getDate().toString().padStart(2, "0")}/${(itemDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${itemDate.getFullYear()}`

      const rowData: any = {
        category: category.name,
        itemName: item.name || "",
        element: item.element || "",
        comments: item.comments || "",
        action: item.action || "",
        frame: item.frame || "",
        summore: item.summore || "",
        status:
          item.status === "checked"
            ? "Checked"
            : item.status === "crossed"
            ? "Failed"
            : "Pending",
        createdAt: itemDateStr,
        categoryCreated: categoryDateStr,
      }

      worksheet.addRow(rowData)

      totalItems++
      if (item.status === "checked") totalChecked++
    })

    // Optional: add a blank row between categories for better visual separation
    worksheet.addRow({})
  })

  // Add Summary Row at the bottom
  const summaryRowNumber = worksheet.rowCount + 2
  worksheet.mergeCells(`A${summaryRowNumber}:J${summaryRowNumber}`)
  const summaryCell = worksheet.getCell(`A${summaryRowNumber}`)
  summaryCell.value = `SUMMARY: ${totalChecked} out of ${totalItems} items completed`
  summaryCell.font = { bold: true, size: 14, color: { argb: "FF17A2A2" } }
  summaryCell.alignment = { horizontal: "center", vertical: "middle" }
  summaryCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF4F4F4" },
  }

  // Generate and download file
  try {
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Housekeeping-Audit-${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Export failed:", error)
    alert("Export failed. Please try again.")
  }
}
  // Open forms
  const openItemForm = (categoryId: string) => {
    setSelectedCategoryId(categoryId)
    setEditingItem(null)
    setShowItemForm(true)
  }

  const openEditForm = (categoryId: string, item: AuditItem) => {
    setSelectedCategoryId(categoryId)
    setEditingItem(item)
    setShowItemForm(true)
  }

  // Filter categories by date
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

  // Calculate stats
  const stats = useMemo(() => {
    const allItems = filteredCategories.flatMap((cat) => cat.items)
    return {
      total: allItems.length,
      checked: allItems.filter((i) => i.status === "checked").length,
    }
  }, [filteredCategories])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2E2E2E]">Housekeeping Audit List</h2>
          {categories.length > 0 && (
            <p className="text-sm text-[#2E2E2E]/60 mt-1">
              Overall: {stats.checked} / {stats.total} completed
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <DateFilter onFilterChange={setDateFilter} activeFilter={dateFilter} />
          <button
            onClick={() => setShowCategoryForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors"
          >
            + Add Category
          </button>
          {categories.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
            >
              Export
            </button>
          )}
        </div>
      </div>

      {/* Category Form */}
      {showCategoryForm && <CategoryForm onSubmit={handleAddCategory} onCancel={() => setShowCategoryForm(false)} />}

      {/* Item Form */}
      {showItemForm && selectedCategoryId && (
        <AuditItemForm
          onSubmitMultiple={handleAddItems}
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

      {/* Content */}
      {categories.length === 0 ? (
        <div className="bg-white border border-[#D7DDE5] rounded-xl p-12 text-center">
          <p className="text-[#2E2E2E]/60 mb-4">No categories yet. Add your first category to get started.</p>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
          >
            + Add Category
          </button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-[#D7DDE5] rounded-xl p-12 text-center">
          <p className="text-[#2E2E2E]/60 mb-4">No items match the current filter.</p>
          <button
            onClick={() => setDateFilter({})}
            className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const date = new Date(category.createdAt)
            const dateStr = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

            return (
              <div key={category.id} className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
                <div className="p-6 border-b border-[#D7DDE5] flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D3C8F]">{category.name}</h3>
                    <p className="text-sm text-[#2E2E2E]/60">Created: {dateStr}</p>
                  </div>
                  <button
                    onClick={() => openItemForm(category.id)}
                    className="px-3 py-1.5 text-sm font-medium text-[#17A2A2] border border-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/10 transition-colors"
                  >
                    + Add Item
                  </button>
                </div>
                <div className="p-6">
                  <AuditTable
                    items={category.items}
                    categoryId={category.id}
                    onToggleStatus={handleToggleStatus}
                    onEdit={(item) => openEditForm(category.id, item)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
