  "use client"

  import { useEffect, useMemo, useState } from "react"
  import CategoryForm from "@/components/category-form"
  import AuditItemForm from "@/components/audit-item-form"
  import AuditTable from "@/components/audit-table"
  import DateFilter from "@/components/date-filter"
  import { exportAuditToPDF } from "@/components/AuditPDFDocument"
  import { useStore } from "@/store/useStore" 
  import type { DateFilter as DateFilterType } from "@/lib/types"
  import axios from "axios"

  export default function HousekeepingAudit() {
    const {
      categories,
      dailyAreas,
      loadingCategories,
      loadingDailyAreas,
      fetchCategories,
      fetchDailyAreas,
      createCategory,
      addDailyArea,
      updateDailyStatus,
    } = useStore()

    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [showItemForm, setShowItemForm] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [dateFilter, setDateFilter] = useState<DateFilterType>({})
    const [exporting, setExporting] = useState(false)
const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

    // NEW: Track which category needs refresh (only one table refreshes)
    const [refreshingCategoryId, setRefreshingCategoryId] = useState<string | null>(null)

    useEffect(() => {
      fetchCategories()
      fetchDailyAreas()
    }, [fetchCategories, fetchDailyAreas])

    const handleExport = async () => {
    if (filteredCategories.length === 0) return;

    setExporting(true);

    try {
      // Pass the data your PDF component expects
      await exportAuditToPDF({
        categories: filteredCategories,
        stats,
        dateFilter: dateFilter.day || dateFilter.month || dateFilter.year
          ? `${dateFilter.day ? `${dateFilter.day}/` : ''}${dateFilter.month || ''}${dateFilter.year ? `/${dateFilter.year}` : ''}`
          : null,
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setExporting(false);
    }
  };

    // Transform data — unchanged logic
    const transformedCategories = useMemo(() => {
      return categories.map(cat => {
        const items = dailyAreas
          .filter(area => area.category === cat.name)
          .flatMap(area => 
            area.dateStatuses.map(status => ({
              _id: status._id, // important for key
              categoryId: cat._id,
              categoryName: area.category,
              element: area.areaName,
              command: status.command || "",
              timeframe: status.actionTimeframe || "Open",
              status: status.status === "ok" ? "checked" : (status.status === "notok" ? "crossed" : "pending"),
              createdAt: status.date || new Date().toISOString(),
            }))
          );

        return {
          id: cat._id,
          name: cat.name,
          createdAt: cat.createdAt || new Date().toISOString(),
          items,
        };
      });
    }, [categories, dailyAreas]);

    const filteredCategories = useMemo(() => {
      if (!dateFilter.day && !dateFilter.month && !dateFilter.year) {
        return transformedCategories
      }

      return transformedCategories
        .map(cat => ({
          ...cat,
          items: cat.items.filter(item => {
            const d = new Date(item.createdAt)
            return (
              (!dateFilter.day || d.getDate() === dateFilter.day) &&
              (!dateFilter.month || d.getMonth() + 1 === dateFilter.month) &&
              (!dateFilter.year || d.getFullYear() === dateFilter.year)
            )
          })
        }))
        .filter(cat => cat.items.length > 0)
    }, [transformedCategories, dateFilter])

    const stats = useMemo(() => {
      const all = filteredCategories.flatMap(c => c.items)
      return {
        total: all.length,
        checked: all.filter(i => i.status === "checked").length,
      }
    }, [filteredCategories])

    const handleAddCategory = async (name: string) => {
      const res = await createCategory({ name, description: "" })
      if (!res.error && res.data) {
        setSelectedCategoryId(res.data._id || res.data.id)
        setShowCategoryForm(false)
        setShowItemForm(true)
      }
    }

    // FIXED: Refresh only the category we added to
    const handleAddItems = async (elements: string[]) => {
    if (!selectedCategoryId) return;

    // Start loading ONLY for this category
    setRefreshingCategoryId(selectedCategoryId);

    try {
      const promises = elements.map(el =>
        addDailyArea({
          categoryId: selectedCategoryId,
          areaName: el.trim(),
        })
      );

      // Wait for all items to be added
      await Promise.all(promises);

      // Optional: Force refetch dailyAreas to ensure latest data
      // (Recommended if your store doesn't auto-update properly)
      await fetchDailyAreas();
    } catch (error) {
      console.error("Failed to add items:", error);
      // Optionally show toast error
    } finally {
      // Now safe to stop loading — data is fresh
      setRefreshingCategoryId(null);

      setShowItemForm(false);
      setSelectedCategoryId(null);
    }
  };


  // Inside HousekeepingAudit.tsx → handleToggleStatus
  // Inside HousekeepingAudit.tsx → handleToggleStatus
  // REPLACE THIS ENTIRE FUNCTION in HousekeepingAudit.tsx
  // Replace your existing handler with this
  const handleToggleStatus = async (
    categoryId: string,
    itemId: string,
    newStatus: "checked" | "crossed"
  ) => {
    const category = filteredCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const item = category.items.find(i => i._id === itemId);
    if (!item) return;

    // FIX: Use TODAY's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // "2025-12-09"

    const payload = {
      dateStatusId: item._id, // this might be wrong — see note below
      categoryId: item.categoryId,
      areaName: item.element,
      date: formattedDate, // ← THIS WAS THE MAIN BUG
      actionTimeframe: item.timeframe || "Open",
      command: item.command || "",
      status: newStatus === "checked" ? "ok" : "notok",
      completed: newStatus === "checked",
    };

    console.log("Sending update for date:", formattedDate, payload);

    try {
      await updateDailyStatus(payload);
      await fetchDailyAreas(); // refresh data
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };






    const openItemForm = (categoryId: string) => {
      setSelectedCategoryId(categoryId)
      setEditingItem(null)
      setShowItemForm(true)
    }

    if (loadingCategories || loadingDailyAreas) {
      return <div className="p-8 text-center">Loading audit data...</div>
    }

    return (
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#2E2E2E]">Housekeeping Audit List</h2>
            {transformedCategories.length > 0 && (
              <p className="text-sm text-[#2E2E2E]/60 mt-1">
                Overall: {stats.checked} / {stats.total} completed
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <DateFilter onFilterChange={setDateFilter} activeFilter={dateFilter} />
            <button onClick={() => setShowCategoryForm(true)} className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90">
              + Add Category
            </button>
            <button onClick={handleExport} disabled={exporting || transformedCategories.length === 0} className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {exporting ? <>Generating…</> : "Export PDF"}
            </button>
          </div>
        </div>

        {/* FORMS */}
        {showCategoryForm && (
          <CategoryForm onSubmit={handleAddCategory} onCancel={() => setShowCategoryForm(false)} />
        )}

        {showItemForm && selectedCategoryId && (
          <AuditItemForm
            categoryName={categories.find(c => c._id === selectedCategoryId)?.name || ""}
            onAdd={handleAddItems}
            onCancel={() => {
              setShowItemForm(false)
              setSelectedCategoryId(null)
            }}
          />
        )}

        {/* MAIN CONTENT */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white border border-[#D7DDE5] rounded-xl p-12 text-center">
            <p className="text-[#2E2E2E]/60 mb-4">
              {transformedCategories.length === 0 
                ? "No categories yet. Add your first category to get started."
                : "No items match the current filter."
              }
            </p>
            {transformedCategories.length === 0 && (
              <button onClick={() => setShowCategoryForm(true)} className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9]">
                + Add Category
              </button>
            )}
            {transformedCategories.length > 0 && (
              <button onClick={() => setDateFilter({})} className="mt-4 text-sm text-[#17A2A2] underline">
                Clear Filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-[#D7DDE5] flex items-center justify-between bg-gradient-to-r from-[#1D3C8F]/5 to-transparent">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1D3C8F]">{category.name}</h3>
                    <p className="text-sm text-[#2E2E2E]/60">
                      Created: {new Date(category.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <button
                    onClick={() => openItemForm(category.id)}
                    className="px-4 py-2 text-sm font-medium text-[#17A2A2] border border-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/10"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="p-6">
                 <AuditTable
  key={`${category.id}-${refreshingCategoryId === category.id ? 'refresh' : ''}`}
  items={category.items}
  isLoading={refreshingCategoryId === category.id} 
  categoryId={category.id}
  categoryName={category.name}
  onToggleStatus={handleToggleStatus}
  onEdit={(item) => {
    setSelectedCategoryId(category.id)
    setEditingItem(item)
    setShowItemForm(true)
  }}
  onUpdateDetails={(itemId, catId, areaName, date, command, timeframe) => {
    setLoadingItemId(itemId); // start loading
    useStore.getState().updateDailyStatus({ 
      dateStatusId: itemId,
      categoryId: catId,
      areaName,
      date,
      command,
      actionTimeframe: timeframe,
      status: "notok",
    })
    .then(() => useStore.getState().fetchDailyAreas())
    .finally(() => setLoadingItemId(null));
  }}
/>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }