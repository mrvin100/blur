import { Users } from "@/modules/users"

export default function UsersPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 sm:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        </div>
        <div className="mt-6">
          <Users />
        </div>
      </div>
    </div>
  )
} 