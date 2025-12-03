"use client"

import type React from "react"

import { LayoutDashboard, ClipboardList, Eye, Users, Settings, LogOut } from "lucide-react"
import type { PageType } from "@/lib/types"

interface SidebarProps {
  activePage: PageType
  setActivePage: (page: PageType) => void
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const menuItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
    { id: "audit", label: "Housekeeping Audit", icon: <ClipboardList className="size-5" /> },
    { id: "observations", label: "Observations", icon: <Eye className="size-5" /> },
    { id: "housekeeping-audits", label: "Housekeeping Audits", icon: <ClipboardList className="size-5" /> },
    { id: "users", label: "Users", icon: <Users className="size-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="size-5" /> },
  ]

  const handleLogout = () => {
    // Ready for API integration - logout logic
    alert("Logout clicked - integrate your auth API here")
  }

  return (
    <aside className="w-64 min-h-screen bg-[#1D3C8F] text-white flex flex-col shadow-lg">
      {/* Logo/Title */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#17A2A2] flex items-center justify-center">
            <ClipboardList className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Hospital Audit</h1>
            <p className="text-xs text-white/60">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Menu</p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors ${
                  activePage === item.id
                    ? "bg-[#17A2A2] text-white font-medium shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="size-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
