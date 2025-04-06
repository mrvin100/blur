import { Metadata } from "next"
import { Permissions } from "@/modules/permissions"

export const metadata: Metadata = {
  title: "Permissions Management",
  description: "Manage permissions for the application",
}

export default function PermissionsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Permissions</h2>
        </div>
        <div className="mt-6">
          <Permissions />
        </div>
      </div>
    </div>
  )
} 