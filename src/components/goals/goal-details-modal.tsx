"use client"

import { Button } from "@/components/ui/button"
import { Goal } from "@/types/goals"
import { Pencil } from "lucide-react"
import { mockUsers } from "@/lib/mock-users"
import Image from "next/image"

interface GoalDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onEdit?: (goal: Goal) => void
}

export function GoalDetailsModal({ isOpen, onClose, goal, onEdit }: GoalDetailsModalProps) {
  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{goal.name}</h2>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onEdit(goal)
                onClose()
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        
        {goal.description && (
          <p className="text-muted-foreground">{goal.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span className={goal.done ? "text-green-600" : "text-yellow-600"}>
              {goal.done ? "Completed" : "In Progress"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Frequency:</span>
            <span>{goal.frequency === "once" ? "One-time" : "Daily"}</span>
          </div>

          {goal.due_date && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Due Date:</span>
              <span>{goal.due_date}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-medium">Visibility:</span>
            <span className="capitalize">{goal.visibility || "public"}</span>
          </div>
        </div>

        {/* Shared With Section */}
        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Shared With</h3>
          <div className="space-y-3">
            {mockUsers.slice(0, 3).map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-secondary">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-lg font-semibold text-muted-foreground">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-sm text-muted-foreground">@{user.username}</div>
                </div>
              </div>
            ))}
            {mockUsers.length > 3 && (
              <div className="text-sm text-muted-foreground">
                +{mockUsers.length - 3} more people
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
} 