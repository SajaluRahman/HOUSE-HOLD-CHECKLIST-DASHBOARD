"use client"

import { useState } from "react"
import type { User } from "@/lib/types"

interface UsersProps {
  users: User[]
  setUsers: (users: User[]) => void
}

// Users management component - ready for API
export default function Users({ users, setUsers }: UsersProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" })
    setEditingUser(null)
    setShowForm(false)
  }

  // Add user - ready for API
  const handleAdd = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) return

    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, newUser])
    resetForm()
  }

  // Edit user - ready for API
  const handleEdit = () => {
    if (!editingUser || !formData.name.trim() || !formData.email.trim()) return

    setUsers(
      users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password || user.password,
            }
          : user,
      ),
    )
    resetForm()
  }

  // Delete user - ready for API
  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  // Open edit form
  const openEditForm = (user: User) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, password: "" })
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#2E2E2E]">Users Management</h2>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors"
        >
          + Add User
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[#D7DDE5] bg-[#1D3C8F]">
            <h3 className="text-lg font-semibold text-white">{editingUser ? "Edit User" : "Add New User"}</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter user name"
                autoFocus
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                Password {editingUser && "(leave blank to keep current)"}
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? "Enter new password" : "Enter password"}
                className="w-full px-4 py-2 border border-[#D7DDE5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17A2A2]"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingUser ? handleEdit : handleAdd}
                disabled={
                  !formData.name.trim() || !formData.email.trim() || (!editingUser && !formData.password.trim())
                }
                className="px-4 py-2 text-sm font-medium text-white bg-[#17A2A2] rounded-lg hover:bg-[#17A2A2]/90 transition-colors disabled:opacity-50"
              >
                {editingUser ? "Update" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      {users.length === 0 ? (
        <div className="bg-white border border-[#D7DDE5] rounded-xl p-12 text-center">
          <p className="text-[#2E2E2E]/60 mb-4">No users yet. Add your first user.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-medium text-[#2E2E2E] bg-white border border-[#D7DDE5] rounded-lg hover:bg-[#F6F7F9] transition-colors"
          >
            + Add User
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#D7DDE5] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D7DDE5] bg-[#F6F7F9]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E] w-16">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#2E2E2E]">Created</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-[#2E2E2E] w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const date = new Date(user.createdAt)
                  const dateStr = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

                  return (
                    <tr key={user.id} className="border-b border-[#D7DDE5]/50 hover:bg-[#F6F7F9]">
                      <td className="px-4 py-3 font-medium text-[#1D3C8F]">{index + 1}</td>
                      <td className="px-4 py-3 text-[#2E2E2E] font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-[#2E2E2E]">{user.email}</td>
                      <td className="px-4 py-3 text-[#2E2E2E]/60 text-sm">{dateStr}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditForm(user)}
                            className="w-8 h-8 rounded-lg border border-[#D7DDE5] text-[#2E2E2E] hover:bg-[#F6F7F9] flex items-center justify-center"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="w-8 h-8 rounded-lg border border-[#D7DDE5] text-red-500 hover:bg-red-50 flex items-center justify-center"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
