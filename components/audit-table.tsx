// components/AuditTable.tsx
"use client";

import { useState } from "react";
import UpdateDetailsModal from "./UpdateDetailsModal";
import type { AuditItem, Timeframe } from "@/lib/types";
import { Check } from "lucide-react";

interface Props {
  items: AuditItem[];
  isLoading?: boolean; // ← NEW: Add loading state
  categoryId: string;
  categoryName: string;
  onToggleStatus: (catId: string, itemId: string, status: "checked" | "crossed") => void;
  onEdit: (item: AuditItem) => void;
  onUpdateDetails: (itemId: string, updates: { comments?: string; timeframe?: Timeframe }) => void;
}

const TIMEFRAME_COLORS: Record<Timeframe, string> = {
  Immediate: "#DC2626",
  Urgent: "#F59E0B",
  Ongoing: "#10B981",
  Open: "#3B82F6",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString("default", { month: "short" }),
    year: d.getFullYear(),
  };
}

export default function AuditTable({
  items,
  isLoading = false,
  categoryId,
  categoryName,
  onToggleStatus,
  onEdit,
  onUpdateDetails,
}: Props) {
  const [modalItem, setModalItem] = useState<AuditItem | null>(null);

  const checkedCount = items.filter((i) => i.status === "checked").length;
  const hasDetails = (item: AuditItem) => !!(item.comments || item.timeframe);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#1D3C8F]/10 to-[#17A2A2]/10 border-b-2 border-[#1D3C8F]/20">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Date</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Element</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Details</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Status</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3">
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-[#1D3C8F]/10 to-[#17A2A2]/10">
              <td colSpan={3} className="px-6 py-5">
                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
              </td>
              <td className="px-6 py-5 text-center">
                <div className="h-10 bg-gray-300 rounded w-24 mx-auto animate-pulse"></div>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  // Empty State
  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 py-20 text-lg font-medium">
        No items yet. Click "Add Item" to begin.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#1D3C8F]/10 to-[#17A2A2]/10 border-b-2 border-[#1D3C8F]/20">
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Date</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Element</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Details</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Status</th>
              <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const date = formatDate(item.createdAt);
              const isChecked = item.status === "checked";
              const isCrossed = item.status === "crossed";

              return (
                <tr
                  key={item._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {date.day}{" "}
                        <span className="text-[#17A2A2] font-bold">{date.month}</span>
                      </div>
                      <div className="text-xs text-gray-500">{date.year}</div>
                    </div>
                  </td>

                  <td
                    className={`px-6 py-4 font-medium ${
                      isCrossed ? "line-through text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {item.element}
                  </td>

                  <td className="px-6 py-4">
                    {item.timeframe ? (
                      <span
                        className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: TIMEFRAME_COLORS[item.timeframe] }}
                      >
                        {item.timeframe}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm italic">No details yet</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {isChecked && <span className="text-2xl text-[#17A2A2]">Check</span>}
                    {isCrossed && <span className="text-2xl text-red-500">Cross</span>}
                    {!isChecked && !isCrossed && <span className="text-gray-300 text-2xl">—</span>}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => onToggleStatus(categoryId, item._id, "checked")}
                        className={`w-10 h-10 rounded-xl flex justify-center items-center text-lg font-bold transition-all ${
                          isChecked
                            ? "bg-[#17A2A2] text-white shadow-lg scale-110"
                            : "border-2 border-gray-300 hover:border-[#17A2A2] hover:bg-[#17A2A2]/5"
                        }`}
                        title="Mark as completed"
                      >
                        <Check className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => onToggleStatus(categoryId, item._id, "crossed")}
                        className={`w-10 h-10 rounded-xl flex justify-center items-center text-lg font-bold transition-all ${
                          isCrossed
                            ? "bg-red-500 text-white shadow-md scale-110"
                            : "border-2 border-gray-300 hover:border-red-400 hover:bg-red-50"
                        }`}
                        title="Mark as not applicable"
                      >
                        X
                      </button>

                      <button
                        onClick={() => setModalItem(item)}
                        className={`w-10 h-10 rounded-xl flex-center text-lg font-bold transition-all shadow-sm ${
                          hasDetails(item)
                            ? "bg-[#17A2A2] text-white ring-2 ring-[#17A2A2]/30"
                            : "bg-gray-100 text-gray-600 hover:bg-[#17A2A2] hover:text-white"
                        }`}
                        title="Add comments & timeframe"
                      >
                        i
                      </button>

                      <button
                        onClick={() => onEdit(item)}
                        className="w-10 h-10 rounded-xl border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 flex-center text-gray-600 text-sm font-medium transition-all"
                        title="Edit element name"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gradient-to-r from-[#1D3C8F]/10 to-[#17A2A2]/10 font-bold text-gray-800">
              <td colSpan={3} className="px-6 py-5 text-lg text-[#1D3C8F]">
                Total Completed
              </td>
              <td className="px-6 py-5 text-center text-3xl text-[#17A2A2]">
                {checkedCount} / {items.length}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Update Details Modal */}
      {modalItem && (
        <UpdateDetailsModal
          item={modalItem}
          isOpen={!!modalItem}
          onClose={() => setModalItem(null)}
          onSave={(comments, timeframe) => {
            onUpdateDetails(modalItem._id, { comments, timeframe });
            setModalItem(null);
          }}
        />
      )}
    </>
  );
}