export type Timeframe = "Immediate" | "Urgent" | "Ongoing" | "Open"

export interface AuditItem {
  id: string
  element: string
  comments: string
  timeframe: Timeframe
  status: "pending" | "checked" | "crossed"
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
