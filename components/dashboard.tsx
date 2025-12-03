"use client"

interface DashboardProps {
  categoriesCount: number
  itemsCount: number
  observationsCount: number
  usersCount: number
}

export default function Dashboard({ categoriesCount, itemsCount, observationsCount, usersCount }: DashboardProps) {
  // Stats cards data
  const stats = [
    { label: "Total Users", value: usersCount, color: "#1D3C8F", icon: "👥" },
    { label: "Categories", value: categoriesCount, color: "#17A2A2", icon: "📁" },
    { label: "Audit Items", value: itemsCount, color: "#10B981", icon: "📋" },
    { label: "Observations", value: observationsCount, color: "#F59E0B", icon: "👁" },
  ]

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-[#2E2E2E]">Dashboard</h2>
        <p className="text-[#2E2E2E]/60">Welcome to the Hospital Audit Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-[#D7DDE5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#2E2E2E]/60">{stat.label}</p>
                <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital Banner */}
      <div className="relative rounded-xl overflow-hidden h-64 bg-gradient-to-r from-[#1D3C8F] to-[#17A2A2]">
        <img src="/modern-hospital-exterior.png" alt="Hospital Banner" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold">Excellence in Healthcare</h3>
            <p className="mt-2 text-white/80">Committed to Quality and Patient Safety</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D7DDE5]">
          <h3 className="text-xl font-bold text-[#1D3C8F] mb-4">About Our Hospital</h3>
          <div className="flex gap-4">
            <img src="/logo.png" alt="Hospital Logo" className="w-24 h-24 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-[#2E2E2E]/80 text-sm leading-relaxed">
                Our hospital is dedicated to providing world-class healthcare services with state-of-the-art facilities
                and experienced medical professionals. We maintain the highest standards of cleanliness and safety
                through rigorous housekeeping audits and quality control measures.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-[#F6F7F9] rounded-lg">
              <p className="text-2xl font-bold text-[#1D3C8F]">500+</p>
              <p className="text-xs text-[#2E2E2E]/60">Beds</p>
            </div>
            <div className="p-3 bg-[#F6F7F9] rounded-lg">
              <p className="text-2xl font-bold text-[#17A2A2]">100+</p>
              <p className="text-xs text-[#2E2E2E]/60">Doctors</p>
            </div>
            <div className="p-3 bg-[#F6F7F9] rounded-lg">
              <p className="text-2xl font-bold text-[#10B981]">24/7</p>
              <p className="text-xs text-[#2E2E2E]/60">Emergency</p>
            </div>
          </div>
        </div>

        {/* Dashboard Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D7DDE5]">
          <h3 className="text-xl font-bold text-[#17A2A2] mb-4">About This Dashboard</h3>
          <div className="flex gap-4">
            <img src="/dashboard-analytics-chart-icon.jpg" alt="Dashboard Icon" className="w-24 h-24 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-[#2E2E2E]/80 text-sm leading-relaxed">
                The Hospital Audit Management System helps you track and manage housekeeping audits, monitor
                observations, and maintain compliance with healthcare standards. Features include priority-based task
                management, date filtering, and comprehensive reporting.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#2E2E2E]/80">
              <span className="text-[#17A2A2]">✓</span> Create and manage audit categories
            </div>
            <div className="flex items-center gap-2 text-sm text-[#2E2E2E]/80">
              <span className="text-[#17A2A2]">✓</span> Track items with priority levels
            </div>
            <div className="flex items-center gap-2 text-sm text-[#2E2E2E]/80">
              <span className="text-[#17A2A2]">✓</span> Record and monitor observations
            </div>
            <div className="flex items-center gap-2 text-sm text-[#2E2E2E]/80">
              <span className="text-[#17A2A2]">✓</span> Export data for reporting
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
