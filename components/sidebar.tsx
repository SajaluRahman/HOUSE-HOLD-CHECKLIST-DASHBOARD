"use client"

import { ClipboardList, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: "audit" | "observations"
  setActiveTab: (tab: "audit" | "observations") => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: "audit" as const,
      label: "Housekeeping Audit List",
      icon: ClipboardList,
    },
    {
      id: "observations" as const,
      label: "Observations",
      icon: Eye,
    },
  ]

  return (
    <aside className="w-64 border-r border-border bg-sidebar min-h-screen">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground">Audit Dashboard</h1>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
              activeTab === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}
