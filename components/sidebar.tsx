"use client"

import type React from "react"
import { useState } from "react"
import { LayoutDashboard, ClipboardList, Eye, Users, Settings, LogOut, Menu, X } from "lucide-react"
import type { PageType } from "@/lib/types"
import { useAdminStore } from "@/store/useAdminStore";


interface SidebarProps {
  activePage: PageType
  setActivePage: (page: PageType) => void
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems: { id: PageType; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="size-5" /> },
    { id: "audit", label: "Housekeeping Audit", icon: <ClipboardList className="size-5" /> },
    { id: "observations", label: "Observations", icon: <Eye className="size-5" /> },
    { id: "users", label: "Users", icon: <Users className="size-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="size-5" /> },
  ]

 const logout = useAdminStore((state) => state.logout);

const handleLogout = async () => {
  await logout();  // 🔥 calls backend + clears state

     // Optional: redirect to login page
    window.location.href = "/login";  
};

  const toggleSidebar = () => setIsOpen(!isOpen)
  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Toggle Button - Visible only on small screens */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1D3C8F] text-white shadow-lg md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Overlay - Darkens screen when mobile menu is open */}
     {isOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
    onClick={closeSidebar}
  />
)}


      

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1D3C8F] text-white shadow-lg transform transition-transform duration-300 z-90 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:z-auto flex flex-col
        `}
      >
        {/* Logo/Title */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#17A2A2] flex items-center justify-center">
                <ClipboardList className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Hospital Audit</h1>
                <p className="text-xs text-white/60">Management System</p>
              </div>
            </div>
            {/* Close button inside sidebar on mobile */}
            <button
              onClick={closeSidebar}
              className="p-1 rounded-lg hover:bg-white/10 md:hidden"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-white/40">Menu</p>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActivePage(item.id)
                    closeSidebar() // Close on mobile after selection
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-all ${
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
            onClick={() => {
              handleLogout()
              closeSidebar()
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="size-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}