import { useState } from "react";
import { useStore } from "@/store/useStore";

type Timeframe = "immediate" | "urgent" | "ongoing" | "open";

const TIMEFRAMES = [
  { value: "immediate" as const, label: "Immediate", color: "#DC2626" },
  { value: "urgent" as const, label: "Urgent", color: "#F59E0B" },
  { value: "ongoing" as const, label: "Ongoing", color: "#10B981" },
  { value: "open" as const, label: "Open", color: "#3B82F6" },
];

interface Props {
  item: { 
    _id: string;
    categoryId: string;
    element: string;
    createdAt: string;
    command?: string;
    timeframe?: Timeframe;
  };
  isOpen: boolean;
  onClose: () => void;
  setLoadingItem: (id: string | null) => void; // NEW: pass loading state to parent
}

export default function UpdateDetailsModal({ item, isOpen, onClose, setLoadingItem }: Props) {
  const [command, setComments] = useState(item.command || "");
  const [timeframe, setTimeframe] = useState<Timeframe>(item.timeframe || "open");

  if (!isOpen) return null;

  const handleSave = async () => {
    const payload = {
      id: item._id,
      categoryId: item.categoryId,
      areaName: item.element,
      date: item.createdAt,
      command: command.trim(),
      actionTimeframe: timeframe,
    
    };

    // Set loading for this item only
    setLoadingItem(item._id);

    try {
      await useStore.getState().updateDailyStatus(payload);
      await useStore.getState().fetchDailyAreas(); // refresh store data
    } catch (err) {
      console.error("Failed to update daily status:", err);
    } finally {
      // Stop loading
      setLoadingItem(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#1D3C8F] to-[#17A2A2] p-6 text-white">
          <h3 className="text-xl font-bold">Update Details</h3>
          <p className="opacity-90 mt-1 text-sm">{item.element}</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comments / Action Required</label>
            <textarea
              value={command}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              placeholder="e.g., Replace broken tile, repaint wall, fix leak..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#17A2A2] focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Action Timeframe</label>
            <div className="grid grid-cols-2 gap-3">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value)}
                  className={`py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                    timeframe === tf.value ? "ring-4 ring-white ring-offset-2 ring-offset-[#17A2A2]" : ""
                  }`}
                  style={{ backgroundColor: tf.color }}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-[#17A2A2] text-white rounded-xl hover:bg-[#17A2A2]/90 font-semibold shadow-lg flex items-center gap-2"
            >
              {/* Simple inline loader */}
              <span>Save Details</span>
              {/** Optionally, show a spinner here if loading */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
