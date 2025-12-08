// Types for easy API integration later

export type Timeframe = "Immediate" | "Urgent" | "Ongoing" | "Open"
export type ItemStatus = "pending" | "checked" | "crossed"
export type PageType = "dashboard" | "audit" | "observations" | "users" | "settings"

export interface AuditItem {
  _id: string
  element: string
  comments?: string          // now optional
  timeframe?: Timeframe      // now optiona
  status: ItemStatus
  createdAt: string
}

export interface Category {
  id: string
  name: string
  items: AuditItem[]
  createdAt: string
}

export interface Observation {
  id: string
  observation: string
  personResponsible: string
  actionPlan: string
  timeFrame: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface DateFilter {
  day?: number
  month?: number
  year?: number
}
