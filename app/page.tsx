"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Dashboard from "@/components/dashboard"
import HousekeepingAudit from "@/components/housekeeping-audit"
import Observations from "@/components/observations"
import Users from "@/components/users"
import Settings from "@/components/settings"
import type { PageType, Category, Observation, User } from "@/lib/types"
import HousekeepingAuditChecklist from "@/components/HousekeepingAuditChecklist"

export default function App() {
  const [activePage, setActivePage] = useState<PageType>("dashboard")

  // Shared state for analytics - ready for API integration
  const [categories, setCategories] = useState<Category[]>([])
  const [observations, setObservations] = useState<Observation[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Render active page
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <Dashboard
            categoriesCount={categories.length}
            itemsCount={categories.reduce((acc, cat) => acc + cat.items.length, 0)}
            observationsCount={observations.length}
            usersCount={users.length}
          />
        )
      case "audit":
        return <HousekeepingAudit categories={categories} setCategories={setCategories} />
      case "observations":
        return <Observations observations={observations} setObservations={setObservations} />
      case "users":
        return <Users users={users} setUsers={setUsers} />
      case "housekeeping-audits":
        return <HousekeepingAuditChecklist />

      case "settings":
        return <Settings />
      default:
        return <Dashboard categoriesCount={0} itemsCount={0} observationsCount={0} usersCount={0} />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-6 overflow-auto bg-[#F6F7F9]">{renderPage()}</main>
    </div>
  )
}
