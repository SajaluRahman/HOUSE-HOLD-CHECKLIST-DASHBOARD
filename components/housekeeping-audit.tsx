"use client"

import { useState, useMemo } from "react"
import CategoryForm from "@/components/category-form"
import AuditItemForm from "@/components/audit-item-form"
import AuditTable from "@/components/audit-table"
import DateFilter from "@/components/date-filter"
import { exportAuditToPDF } from "@/components/AuditPDFDocument";
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
const [exporting, setExporting] = useState(false);
  // Add new category
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

  // Add multiple items
  const handleAddItems = (items: Omit<AuditItem, "id" | "status" | "createdAt">[]) => {
    if (!selectedCategoryId) return

    const newItems: AuditItem[] = items.map((item, index) => ({
      ...item,
      id: (Date.now() + index).toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    }))

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategoryId
          ? { ...cat, items: [...cat.items, ...newItems] }
          : cat
      )
    )
    setShowItemForm(false)
  }

  // Edit single item
  const handleEditItem = (item: Omit<AuditItem, "id" | "status" | "createdAt">) => {
    if (!editingItem || !selectedCategoryId) return

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategoryId
          ? {
              ...cat,
              items: cat.items.map((i) =>
                i.id === editingItem.id ? { ...i, ...item, status: i.status } : i
              ),
            }
          : cat
      )
    )
    setEditingItem(null)
    setShowItemForm(false)
  }

  // Toggle status
  const handleToggleStatus = (categoryId: string, itemId: string, status: "checked" | "crossed") => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId
                  ? { ...item, status: item.status === status ? "pending" : status }
                  : item
              ),
            }
          : cat
      )
    )
  }

  // Placeholder for export (currently disabled / not implemented)
 const handleExport = async () => {
  if (exporting) return;
  setExporting(true);

  // Prompt the user for the extra printable fields (optional but nice)
  const inspectedBy = prompt("Inspected by (name):")?.trim() || "";
  const location = prompt("Base Location:")?.trim() || "";
  const department = prompt("Ward/Unit/Department:")?.trim() || "";
  const today = new Date();
  const date = today.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const time = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  try {
    await exportAuditToPDF(filteredCategories, inspectedBy, date, time, location, department);
  } catch (e) {
    alert("PDF generation failed – check console.");
    console.error(e);
  } finally {
    setExporting(false);
  }
};

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

  // Filter items by date
  const filteredCategories = useMemo(() => {
    if (!dateFilter.day && !dateFilter.month && !dateFilter.year) {
      return categories
    }

    return categories
      .map((cat) => {
        const filteredItems = cat.items.filter((item) => {
          const d = new Date(item.createdAt)
          return (
            (!dateFilter.day || d.getDate() === dateFilter.day) &&
            (!dateFilter.month || d.getMonth() + 1 === dateFilter.month) &&
            (!dateFilter.year || d.getFullYear() === dateFilter.year)
          )
        })
        return { ...cat, items: filteredItems }
      })
      .filter((cat) => cat.items.length > 0)
  }, [categories, dateFilter])

  const stats = useMemo(() => {
    const all = filteredCategories.flatMap((c) => c.items)
    return {
      total: all.length,
      checked: all.filter((i) => i.status === "checked").length,
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
            className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90"
          >
            + Add Category
          </button>
          {categories.length > 0 && (
          <button
  onClick={handleExport}
  disabled={exporting || categories.length === 0}
  className={`
    px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg
    hover:bg-[#F6F7F9] disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center gap-2
  `}
>
  {exporting ? (
    <>
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      Generating…
    </>
  ) : (
    "Export"
  )}
</button>
          )}
        </div>
      </div>

      {/* Forms */}
      {showCategoryForm && (
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setShowCategoryForm(false)}
        />
      )}

    {showItemForm && selectedCategoryId && (
  <>
    {/* Add New Items - Only Element */}
    {!editingItem && (
      <AuditItemForm
        categoryName={categories.find((c) => c.id === selectedCategoryId)?.name || ""}
        onAdd={(elements: string[]) => {
          const newItems: AuditItem[] = elements.map((el) => ({
            id: crypto.randomUUID(),
            categoryId: selectedCategoryId,
            element: el.trim(),
            comments: "",
            timeframe: "Open" as const,
            status: "pending" as const,
            createdAt: new Date().toISOString(),
          }))

          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === selectedCategoryId
                ? { ...cat, items: [...cat.items, ...newItems] }
                : cat
            )
          )
          setShowItemForm(false)
        }}
        onCancel={() => {
          setShowItemForm(false)
          setEditingItem(null)
        }}
      />
    )}

    {/* Edit Existing Item (Element Only) */}
    {editingItem && (
      <div className="bg-white border border-[#D7DDE5] rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-[#1D3C8F] mb-4">
          Edit Item — {categories.find((c) => c.id === selectedCategoryId)?.name}
        </h3>
        <input
          type="text"
          defaultValue={editingItem.element}
          autoFocus
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-[#17A2A2] focus:outline-none text-lg mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const newElement = e.currentTarget.value.trim()
              if (newElement) {
                setCategories((prev) =>
                  prev.map((cat) =>
                    cat.id === selectedCategoryId
                      ? {
                          ...cat,
                          items: cat.items.map((i) =>
                            i.id === editingItem.id ? { ...i, element: newElement } : i
                          ),
                        }
                      : cat
                  )
                )
                setEditingItem(null)
                setShowItemForm(false)
              }
            }
            if (e.key === "Escape") {
              setEditingItem(null)
              setShowItemForm(false)
            }
          }}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setEditingItem(null)
              setShowItemForm(false)
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">Press Enter to save • Esc to cancel</p>
      </div>
    )}
  </>
)}

      {/* Content */}
      {categories.length === 0 ? (
        <div className="bg-white border border-[#D7DDE5] rounded-xl p-12 text-center">
          <p className="text-[#2E2E2E]/60 mb-4">
            No categories yet. Add your first category to get started.
          </p>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9]"
          >
            + Add Category
          </button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-[#D7DDE5] rounded-xl p-12 text-center">
          <p className="text-[#2E2E2E]/60 mb-4">No items match the current filter.</p>
          <button
            onClick={() => setDateFilter({})}
            className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9]"
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
              <div
                key={category.id}
                className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden shadow-sm"
              >
                <div className="p-6 border-b border-[#D7DDE5] flex items-center justify-between bg-gradient-to-r from-[#1D3C8F]/5 to-transparent">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D3C8F]">{category.name}</h3>
                    <p className="text-sm text-[#2E2E2E]/60">Created: {dateStr}</p>
                  </div>
                  <button
                    onClick={() => openItemForm(category.id)}
                    className="px-4 py-2 text-sm font-medium text-[#17A2A2] border border-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/10 transition"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="p-6">
                 <AuditTable
  items={category.items}
  categoryId={category.id}
  categoryName={category.name}
  onToggleStatus={handleToggleStatus}
  onEdit={(item) => openEditForm(category.id, item)}
  onUpdateDetails={(itemId: string, updates: { comments?: string; timeframe?: Timeframe }) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === category.id
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, ...updates } : item
              )
            }
          : cat
      )
    )
  }}
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