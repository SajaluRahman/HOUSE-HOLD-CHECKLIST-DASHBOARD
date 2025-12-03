"use client"

import type React from "react"

import { useState } from "react"

// Settings component - ready for API integration
export default function Settings() {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile")

  // Profile form state
  const [profile, setProfile] = useState({
    username: "admin",
    email: "admin@hospital.com",
  })

  // Password form state
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // Handle profile update - ready for API
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // API call goes here
    alert("Profile updated successfully!")
  }

  // Handle password change - ready for API
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!")
      return
    }
    // API call goes here
    alert("Password changed successfully!")
    setPasswords({ current: "", new: "", confirm: "" })
  }

  // Handle forgot password - ready for API
  const handleForgotPassword = () => {
    // API call goes here
    alert("Password reset link sent to your email!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#2E2E2E]">Settings</h2>
        <p className="text-[#2E2E2E]/60">Manage your account settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#D7DDE5]">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-[#17A2A2] text-[#17A2A2]"
              : "border-transparent text-[#2E2E2E]/60 hover:text-[#2E2E2E]"
          }`}
        >
          Profile Settings
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "password"
              ? "border-[#17A2A2] text-[#17A2A2]"
              : "border-transparent text-[#2E2E2E]/60 hover:text-[#2E2E2E]"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#D7DDE5] bg-[#1D3C8F]">
            <h3 className="text-lg font-semibold text-white">Profile Information</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Password Settings */}
      {activeTab === "password" && (
        <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#D7DDE5] bg-[#1D3C8F]">
            <h3 className="text-lg font-semibold text-white">Change Password</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={handleForgotPassword} className="text-sm text-[#1D3C8F] hover:underline">
                  Forgot Password?
                </button>
                <button
                  type="submit"
                  disabled={!passwords.current || !passwords.new || !passwords.confirm}
                  className="px-6 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors disabled:opacity-50"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
