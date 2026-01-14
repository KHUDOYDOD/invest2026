import { AdminSidebar } from "./sidebar"

interface AdminNavProps {
  activeItem?: string
}

export function AdminNav({ activeItem }: AdminNavProps) {
  return <AdminSidebar />
}