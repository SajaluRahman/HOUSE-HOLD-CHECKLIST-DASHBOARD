"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { HousekeepingAudit } from "@/components/housekeeping-audit"
import { Observations } from "@/components/observations"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"audit" | "observations">("audit")

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "audit" ? <HousekeepingAudit /> : <Observations />}
      </main>
    </div>
  )
}
